import USE_CASE from '@/constants/UseCaseIdentifiers';
import { AuthService } from '@/renderer/core/auth/AuthService';
import { AuthUseCases } from '@/renderer/core/auth/AuthUseCases';
import { OccurrenceService } from '@/renderer/core/occurrence/OccurrenceService';
import { OccurrenceUseCases } from '@/renderer/core/occurrence/OccurrenceUseCases';
import { ReflectionService } from '@/renderer/core/reflection/ReflectionService';
import { ReflectionUseCases } from '@/renderer/core/reflection/ReflectionUseCases';
import { UserService } from '@/renderer/core/user/UserService';
import { UserUseCases } from '@/renderer/core/user/UserUseCases';
import { JwtAuthService } from '@/renderer/infrastructure/auth/JwtAuthService';
import { HttpService } from '@/renderer/infrastructure/http/HttpService';
import { HttpOccurrenceService } from '@/renderer/infrastructure/occurrence/HttpOccurrenceService';
import { HttpReflectionService } from '@/renderer/infrastructure/reflection/HttpReflectionService';
import { HttpUserService } from '@/renderer/infrastructure/user/HttpUserService';
import { Container } from 'inversify';
import SERVICE from '@/constants/ServiceIdentifiers';

const container = new Container();
container.bind<HttpService>(SERVICE.HTTP).to(HttpService);
container.bind<AuthService>(SERVICE.AUTH).to(JwtAuthService);
container.bind<UserService>(SERVICE.USER).to(HttpUserService);
container.bind<OccurrenceService>(SERVICE.OCCURRENCE).to(HttpOccurrenceService);
container.bind<ReflectionService>(SERVICE.REFLECTION).to(HttpReflectionService);

container.bind<AuthUseCases>(USE_CASE.AUTH).to(AuthUseCases);
container.bind<UserUseCases>(USE_CASE.USER).to(UserUseCases);
container.bind<OccurrenceUseCases>(USE_CASE.OCCURRENCE).to(OccurrenceUseCases);
container.bind<ReflectionUseCases>(USE_CASE.REFLECTION).to(ReflectionUseCases);

export default container;
