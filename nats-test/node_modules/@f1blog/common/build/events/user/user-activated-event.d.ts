import { Subjects } from '../subjects';
export interface UserActivatedEvent {
    subject: Subjects.UserActivated;
    data: {
        id: string;
        email: string;
        name: string;
    };
}
