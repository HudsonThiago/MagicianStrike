import type { FormikProps } from "formik";

export const setErrors=(formik:FormikProps<any>, error:any)=>{
    const detail:object = error.response.data.detail
    for (const [key, value] of Object.entries(detail)) {
        formik.setFieldError(key, value);
    }
}