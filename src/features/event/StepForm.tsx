import { Button, Form, FormInstance, FormProps, Steps } from 'antd'
import { Rule } from 'rc-field-form/lib/interface'
import { ReactElement, useEffect, useState } from 'react'

const { Step } = Steps

export type FormItemConfig<Form> = {
  element: ReactElement
  label?: string
  required?: boolean | ((form: Form, initialData?: unknown) => boolean)
  display?: (form: Form, initialData?: unknown) => boolean
  help?: string
  rules?: Rule[]
  excluded?: boolean
}

export type FormConfig<FormType, AdditionalFields extends string> = {
  [name in
    | Extract<keyof FormType, string>
    | AdditionalFields]: FormItemConfig<FormType>
}

export interface StepConfig<FormType, AdditionalFields> {
  title: string
  items: (Extract<keyof FormType, string> | AdditionalFields)[]
}

const isRequired = function <FormType>(
  required: FormItemConfig<FormType>['required'],
  form: FormInstance<FormType>,
  initialData?: unknown,
) {
  return typeof required === 'function'
    ? required(form.getFieldsValue(), initialData)
    : required ?? false
}

const isItemValid = function <FormType>(
  name: Extract<keyof FormType, string>,
  formConfig: FormConfig<FormType, never>,
  form: FormInstance<FormType>,
  initialData: unknown,
) {
  const itemExists = !!form.getFieldInstance(name)
  const isItemTouched = form.isFieldTouched(name)
  const isItemRequired = isRequired(
    formConfig[name].required,
    form,
    initialData,
  )
  const hasItemErrors = form.getFieldError(name).length > 0

  // success
  // item doesn't exist (nothing to validate)
  // OR
  // item exists and doesn't have errors AND (is touched OR is not required)
  // because we want every required field touched
  const isValid =
    !itemExists || (!hasItemErrors && (isItemTouched || !isItemRequired))

  return isValid
}

const isStepValid = function <T>(
  step: Extract<keyof T, string>[],
  formConfig: FormConfig<T, never>,
  form: FormInstance<T>,
  initialData: unknown,
) {
  return step.every(name => isItemValid(name, formConfig, form, initialData))
}

interface StepFormProps<FormType, AdditionalFields extends string>
  extends FormProps {
  steps: StepConfig<FormType, AdditionalFields>[]
  formItems: FormConfig<FormType, AdditionalFields>
  initialData?: unknown
  initialFormData?: Parameters<FormInstance<FormType>['setFieldsValue']>[0]
}

const StepForm = function <FormType, AdditionalFields extends string>({
  steps: stepConfig,
  formItems,
  initialData,
  initialFormData,
  ...props
}: StepFormProps<FormType, AdditionalFields>) {
  const [step, setStep] = useState(0)
  const [form] = Form.useForm<FormType>()

  useEffect(() => {
    if (initialFormData) {
      form.setFieldsValue(initialFormData)
      form.validateFields()
    }
  }, [initialFormData, form])

  const steps = stepConfig.map(({ items }) =>
    items.map(name => {
      const item = formItems[name]
      const shouldUpdate =
        typeof item.display === 'function' ||
        typeof item.required === 'function'
      const requiredRule = isRequired(item.required, form, initialData)
        ? [
            {
              required: true,
              message: 'Povinné pole',
            },
          ]
        : []
      // @TODO Format the wrapper Form.Item in a way that it doesn't have margin bottom and min-height (so it is invisible when not displayed)

      type FormInstanceType = typeof form

      const getFormItem = (form: FormInstanceType) =>
        item.excluded ? (
          item.element
        ) : (
          <Form.Item
            name={name}
            label={item?.label}
            tooltip={item?.help}
            required={isRequired(item.required, form, initialData)}
            rules={[...requiredRule, ...(item?.rules ?? [])]}
          >
            {item.element}
          </Form.Item>
        )

      return (
        <Form.Item key={name} shouldUpdate={shouldUpdate} className="mb-0">
          {shouldUpdate
            ? () =>
                (typeof item.display === 'function'
                  ? item.display(form.getFieldsValue(), initialData)
                  : item?.display ?? true) && getFormItem(form)
            : getFormItem(form)}
        </Form.Item>
      )
    }),
  )

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFieldsChange={a => console.log(a)}
        onValuesChange={b => console.log(b)}
        onFinish={form => console.log(form)}
        {...props}
      >
        <Form.Item shouldUpdate>
          {() => (
            <Steps size="small" current={step} className="mb-8">
              {stepConfig.map(({ title, items }, index) => (
                <Step
                  title={title}
                  key={index}
                  onStepClick={i => setStep(i)}
                  status={
                    index === step
                      ? 'process'
                      : isStepValid<FormType>(
                          items as Extract<keyof FormType, string>[],
                          formItems,
                          form,
                          initialData,
                        )
                      ? 'finish'
                      : 'error'
                  }
                />
              ))}
            </Steps>
          )}
        </Form.Item>
        {steps.map((children, index) => (
          <div
            style={{
              display: step === index ? 'block' : 'none',
            }}
            key={index}
          >
            {children}
          </div>
        ))}
        <div className="steps-action">
          {step > 0 && (
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => setStep(step => step - 1)}
            >
              Zpět
            </Button>
          )}
          {step < steps.length - 1 && (
            <Button type="primary" onClick={() => setStep(step => step + 1)}>
              Dál
            </Button>
          )}
          {step === steps.length - 1 && (
            <Button type="primary" htmlType="submit">
              Hotovo
            </Button>
          )}
        </div>
      </Form>
    </>
  )
}

export default StepForm
