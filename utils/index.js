import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password')
});

export const signupValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'As senhas devem ser iguais.')
    .required('Confirme sua senha.')
});

export const passwordResetSchema = Yup.object().shape({
  email: Yup.string()
    .required('Por favor, entre com um email válido')
    .label('Email')
    .email('Entre com um email válido')
});
