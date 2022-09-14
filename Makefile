.PHONY: build run dev_mac dev_wsl dev_linux no_python_mac no_python_wsl no_python_linux test test_wsl clean submodule_checkout_next submodule_update gen_dev_dockercompose_file open_cypress_wsl prepare_test_env startup_testing_backend backend frontend

define with_os
if [ "$(shell uname)" = "Darwin" ]; then		                                           \
	OS='mac';								                                               \
elif grep -q icrosoft /proc/version; then	                                               \
	OS='wsl';								                                               \
else											                                           \
	OS='linux';								                                               \
fi;											                                               \
$1
endef

define with_trap
$(call with_os, bash -c "trap 'make clean' EXIT; $1")
endef


define compose_with_trap
$(call with_trap, docker-compose                                                           \
    -f docker-compose.yaml                                                                 \
    -f docker-compose/dev.yaml $1)
endef

build: .env submodule_sync
	echo '.git' > .dockerignore
	cat .gitignore >> .dockerignore
	docker-compose build
	make gen_dev_dockercompose_file

.env:
	cp .example.env .env

gen_dev_dockercompose_file:
	echo "# Generated dev compose config for python dev env, changes will be overridden" > \
	    docker-compose/dev_exported_config.yaml

	$(call compose_with_trap,                                                              \
	    --profile backend config >> docker-compose/dev_exported_config.yaml)

submodule_sync:
	# check all submodule directories for not-yet initialized ones and drops them,
	# then sync and initialization is processed
	BASE_PATH=`pwd`															; \
	cat .gitmodules | grep 'path =' | cut -d ' ' -f3 | while read -r path; do \
		if [ ! -f "$$BASE_PATH/$$path/.git" ]; then 						  \
			echo "initializing '$$BASE_PATH/$$path/.git'"					; \
			rm -Rf $$BASE_PATH/$$path										; \
		fi																	; \
	done																	; \

	git submodule sync
	git submodule update --init --recursive

submodule_checkout_next:
	# 1. cd to each submodule
	# 2. stash all local changes
	# 3. checkout branch `next`
	# 4. unstash local changes back
	BASE_PATH=`pwd`															; \
	cat .gitmodules | grep 'path =' | cut -d ' ' -f3 | while read -r path; do \
		cd $$BASE_PATH/$$path												; \
		echo "entering '$$path'"											; \
		git stash 2>&1 | grep -vi 'no local changes'						; \
		git checkout next 2>&1 | grep -vi 'already' | grep -vi 'up to date'	; \
		git stash pop 2>&1 | grep -vi 'no stash entries found'				; \
	done																	; \
	echo "done"

submodule_update: submodule_sync
	# update all submodules to their latest versions
	git submodule update --init --recursive --remote

run:
	docker-compose up -d

dev:
	$(call compose_with_trap,                                                              \
		--profile dev                                                                   \
		-f docker-compose/dev_$$OS.yaml up)

backend:
	$(call compose_with_trap,                                                              \
		--profile backend                                                                   \
		-f docker-compose/dev_$$OS.yaml up)

frontend:
	$(call compose_with_trap,                                                              \
		--profile frontned                                                                   \
		-f docker-compose/dev_$$OS.yaml up)

node_modules/cypress/bin/cypress:
	yarn add cypress wait-on --dev

prepare_test_env:
	rm -Rf ./*data_test
	docker volume rm -f postgresqldata_test
	docker volume create postgresqldata_test

startup_testing_backend:
	$(call with_os,                                                                        \
	    docker-compose                                                                     \
	        --profile backend                                                               \
            -f docker-compose.yaml                                                         \
            -f docker-compose/dev.yaml                                                     \
            -f docker-compose/dev_test.yaml                                                \
            -f docker-compose/dev_test_$$OS.yaml up -d)

test: node_modules/cypress/bin/cypress prepare_test_env
	$(call compose_with_trap,                                                              \
		-f docker-compose/dev_test.yaml                                                    \
		-f docker-compose/dev_test_$$OS.yaml run backend test)
	$(call compose_with_trap,                                                              \
		-f docker-compose/dev_test.yaml                                                    \
		-f docker-compose/dev_test_$$OS.yaml run frontend test)

	make prepare_test_env
	make startup_testing_backend
	yarn run wait-on http-get://localhost/api/
	$(call with_trap, yarn run cypress run)


open_cypress: node_modules/cypress/bin/cypress prepare_test_env
	make startup_testing_backend
	yarn run wait-on http-get://localhost/api/
	$(call with_trap, yarn run cypress open)

clean:
	docker-compose down -t 0 --remove-orphans
