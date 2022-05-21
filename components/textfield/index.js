import React from 'react'
import { ErrorMessage, useField } from 'formik'

function TextField({ ...props }) {
  const [field, meta] = useField(props)

  return (
    <>
      <input
        className={` w-full rounded-2xl border-[1px] border-[#96A9BA] px-4 py-2 text-[12px] font-light ${
          meta.touched && meta.error && ' border-red-600'
        } `}
        {...field}
        {...props}
      />

      <div className="flex items-center pl-4 pt-2 text-left text-[14px] text-red-500">
        <ErrorMessage className="" name={field.name} />
      </div>
    </>
  )
}

export default TextField
