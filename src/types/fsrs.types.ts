export type FSRSState = 'New' | 'Learning' | 'Review' | 'Relearning';

export type FSRSRating = 'Again' | 'Hard' | 'Good' | 'Easy';

export interface FSRSCard {
    id: string; // References character or word ID
    state: FSRSState;
    stability: number; // Memory strength (days until 90% retention prob)
    difficulty: number; // 1-10
    elapsed_days: number;
    scheduled_days: number;
    reps: number;
    lapses: number;
    last_review?: Date;
    due: Date;
}

export interface FSRSLog {
    card_id: string;
    rating: FSRSRating;
    state: FSRSState;
    due: Date; // When it was due
    review: Date; // When it was actually reviewed
    elapsed_days: number;
    scheduled_days: number;
}

export interface FSRSParameters {
    request_retention: number; // 0.9 default
    maximum_interval: number; // 36500 default
    w: number[]; // 19 weight parameters
}

export const DEFAULT_FSRS_PARAMETERS: FSRSParameters = {
    request_retention: 0.9,
    maximum_interval: 36500,
    w: [
        0.40255, 1.18385, 3.173, 15.69105, 7.19497, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192, 1.01925,
        1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621,
    ],
};
