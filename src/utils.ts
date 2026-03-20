import { AvatarClass } from './types';

/**
 * Calculates XP based on budget accuracy.
 * @param {number} planned - The budgeted amount.
 * @param {number} actual - The actual amount spent.
 * @param {AvatarClass} avatarClass - The user's avatar class.
 * @returns {number} XP earned.
 */
export function calculateBudgetXP(planned: number, actual: number, avatarClass: AvatarClass): number {
  const baseXP = 100;
  const accuracy = actual <= planned ? 1 : planned / actual;
  
  // Bonus for staying under budget
  let multiplier = actual <= planned ? 1.5 : 0.5;
  
  // Class-specific bonuses
  if (avatarClass === 'Warrior' && actual < planned) {
    multiplier *= 1.2;
  } else if (avatarClass === 'Rogue' && Math.abs(actual - planned) < 10) {
    multiplier *= 1.2;
  } else if (avatarClass === 'Mage') {
    multiplier *= 1.1; // Small consistent bonus
  }
  
  const earnedXP = Math.floor(baseXP * accuracy * multiplier);
  
  return Math.max(0, earnedXP); // Ensure non-negative XP
}

/**
 * Checks if a user should level up.
 * @param {number} currentXP - The user's current XP.
 * @param {number} nextLevelXP - The XP required for the next level.
 * @returns {boolean} True if the user should level up.
 */
export function shouldLevelUp(currentXP: number, nextLevelXP: number): boolean {
  return currentXP >= nextLevelXP;
}
