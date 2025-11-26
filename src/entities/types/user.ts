export interface User {
    userId: string;
    email: string;
    displayName: string;
    role: 'LEARNER' | 'ADMIN';
    registrationDate: string;
    avatar?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    displayName: string;
}

export interface ResetPasswordRequest {
    email: string;
}
