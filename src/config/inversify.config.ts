import USE_CASE from '@/constants/UseCaseIdentifiers';
import { AuthService } from '@/core/auth/AuthService';
import { AuthUseCases } from '@/core/auth/AuthUseCases';
import { UserService } from '@/core/user/UserService';
import { UserUseCases } from '@/core/user/UserUseCases';
import { JwtAuthService } from '@/infrastructure/auth/JwtAuthService';
import { HttpService } from '@/infrastructure/http/HttpService';
import { HttpUserService } from '@/infrastructure/user/HttpUserService';
import { Container } from 'inversify';
import SERVICE from '@/constants/ServiceIdentifiers';

const container = new Container();
container.bind<HttpService>(SERVICE.HTTP).to(HttpService);
container.bind<AuthService>(SERVICE.AUTH).to(JwtAuthService);
container.bind<UserService>(SERVICE.USER).to(HttpUserService);

container.bind<AuthUseCases>(USE_CASE.AUTH).to(AuthUseCases);
container.bind<UserUseCases>(USE_CASE.USER).to(UserUseCases);

export default container;
