import { User } from '../../models/domain/user';
import { UserResponseDTO } from '../../dtos';

export const mappers = {
    toUserResponseDTO(user: User): UserResponseDTO {
        return {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                biography: user.biography
            }
        }
    }
}