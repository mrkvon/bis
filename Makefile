.PHONY: build run dev_mac dev_wsl dev_linux no_python_mac no_python_wsl no_python_linux test test_wsl clean gen_dev_dockercompose_file

define compose_with_trap
bash -c "trap 'make clean' EXIT; docker-compose -f docker-compose.yaml -f docker-compose/dev.yaml $1"
endef

build: .env
	echo '.git' > .dockerignore
	cat .gitignore >> .dockerignore
	docker-compose build
	make gen_dev_dockercompose_file

.env:
	cp .example.env .env

gen_dev_dockercompose_file:
	echo "# Generated dev compose config for python dev env, changes will be overridden" > docker-compose/.dev.yaml
	$(call compose_with_trap, --profile python config >> docker-compose/.dev.yaml)


run:
	docker-compose up -d

dev_mac:
	$(call compose_with_trap, --profile dev up)

dev_wsl:
	$(call compose_with_trap, --profile dev -f docker-compose/wsl.yaml up)

dev_linux:
	$(call compose_with_trap, --profile dev -f docker-compose/linux.yaml up)

backend_mac:
	$(call compose_with_trap, --profile backend up)

backend_wsl:
	$(call compose_with_trap, --profile backend -f docker-compose/wsl.yaml up)

backend_linux:
	$(call compose_with_trap, --profile backend -f docker-compose/linux.yaml up)

frontend_mac:
	$(call compose_with_trap, --profile frontend up)

frontend_wsl:
	$(call compose_with_trap, --profile frontend -f docker-compose/wsl.yaml up)

frontend_linux:
	$(call compose_with_trap, --profile frontend -f docker-compose/linux.yaml up)

test:
	rm -Rf ./*data_test
	$(call compose_with_trap, -f docker-compose/test.yaml run backend test)

test_wsl:
	docker volume rm -f postgresqldata_test
	docker volume create postgresqldata_test
	rm -Rf ./*data_test
	$(call compose_with_trap, -f docker-compose/test_wsl.yaml run backend test)

clean:
	docker-compose down -t 0 --remove-orphans
