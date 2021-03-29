import { Container } from 'inversify';
import { HttpService } from '@/services/http/HttpService';
import { AuthService } from '@/services/auth/AuthService';
import SERVICE from '@/constants/ServiceIdentifiers';

const container = new Container();
container.bind<AuthService>(SERVICE.AUTH).to(AuthService);
container.bind<HttpService>(SERVICE.HTTP).to(HttpService);

export default container;
