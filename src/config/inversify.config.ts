import { AuthService } from '@/core/auth/AuthService';
import { JwtAuthService } from '@/infrastructure/auth/JwtAuthService';
import { HttpService } from '@/infrastructure/http/HttpService';
import { Container } from 'inversify';
import SERVICE from '@/constants/ServiceIdentifiers';

const container = new Container();
container.bind<AuthService>(SERVICE.AUTH).to(JwtAuthService);
container.bind<HttpService>(SERVICE.HTTP).to(HttpService);

export default container;
