import { IDomainPersistenceMapper } from '../../../../common/mappers/domain-dal/mapper';

import { User } from '../../models/domain/user';
import { UserDalEntity } from '../../models/entity/user';

export default (): IDomainPersistenceMapper<User, UserDalEntity> => ({
    toPersistence: (user: User): UserDalEntity => ({
        user_id: user.id,
        first_name: user.firstName,
        last_name: user.lastName,
        username: user.username,
        biography: user.biography,
        email: user.email,
        password: user.password
    }),
    toDomain: (raw: UserDalEntity): User => ({
        id: raw.user_id,
        firstName: raw.first_name,
        lastName: raw.last_name,
        username: raw.username,
        biography: raw.biography,
        email: raw.email,
        password: raw.password
    })
})