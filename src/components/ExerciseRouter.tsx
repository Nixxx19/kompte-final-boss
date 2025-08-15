// ExerciseRouter.jsx
import JumpingJacks from './JumpingJacks';
import PushUps from './Pushup';
import SquatsTracker from "@/components/SquatsTracker.tsx";

// import more as needed

const exerciseComponentMap = {
    'Jumping Jacks': JumpingJacks,
    'Push Ups': PushUps,
    'Squats': SquatsTracker
    // Add more as needed
};

export default exerciseComponentMap;
