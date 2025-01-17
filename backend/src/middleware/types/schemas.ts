import * as yup from 'yup';

export const receiveProof = yup.object({
  body: yup.object({
    proofs: yup.string().required(),
    provider: yup.string().required(),
    address: yup.string().required(),
  })
});
