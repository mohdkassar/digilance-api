export default interface INodeMailerConfig {
  host: string;
  secure: boolean;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
}
