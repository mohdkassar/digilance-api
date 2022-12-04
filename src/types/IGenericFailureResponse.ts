import IGenericResponse from './IGenericResponse';

export default interface IGenericFailureResponse extends IGenericResponse {
  message: string;
}
