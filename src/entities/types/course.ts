export enum Level {
    BEGINNER_A = 'Beginner A',
    BEGINNER_B = 'Beginner B',
    INTERMEDIATE = 'Intermediate',
    ADVANCED = 'Advanced'
}

export interface Course {
    courseId: string;
    name: string;
    nameZh: string;
    level: Level;
    progress: number;
}
