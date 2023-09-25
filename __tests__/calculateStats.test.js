function calculateStats() {

    let wins = 0;
    let currentStreak = 0;
    let maxStreak = 0;
    let streakCount = 0;
    const totalGames = scores.length;

    scores.forEach(score => {
        if (score !== 0) {
            wins++;
            streakCount++;
            if (streakCount > maxStreak) maxStreak = streakCount;
        } else {
            streakCount = 0;
        }
    });

    const winPercentage = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(0) : '0';

    // Check if the last game is a loss and adjust currentStreak accordingly
    if (scores.length > 0 && scores[scores.length - 1] === 0) {
        currentStreak = 0;
    } else {
        currentStreak = streakCount;
    }

    return { winPercentage, currentStreak, maxStreak, totalGames };
}

describe('calculateStats', () => {
  
    it('should calculate stats correctly for an all-wins score', () => {
        global.scores = [1, 1, 1]; // assuming 1 represents a win
        const stats = calculateStats();
        expect(stats.winPercentage).toBe('100');
        expect(stats.currentStreak).toBe(3);
        expect(stats.maxStreak).toBe(3);
        expect(stats.totalGames).toBe(3);
    });
    
    it('should calculate stats correctly for an all-losses score', () => {
        global.scores = [0, 0, 0];
        const stats = calculateStats();
        expect(stats.winPercentage).toBe('0');
        expect(stats.currentStreak).toBe(0);
        expect(stats.maxStreak).toBe(0);
        expect(stats.totalGames).toBe(3);
    });

    it('should calculate stats correctly for a mixed score', () => {
        global.scores = [1, 0, 1, 1, 0, 1];
        const stats = calculateStats();
        expect(stats.winPercentage).toBe('67');
        expect(stats.currentStreak).toBe(1);
        expect(stats.maxStreak).toBe(2);
        expect(stats.totalGames).toBe(6);
    });

    it('should handle an empty scores array gracefully', () => {
        global.scores = [];
        const stats = calculateStats();
        expect(stats.winPercentage).toBe('0');
        expect(stats.currentStreak).toBe(0);
        expect(stats.maxStreak).toBe(0);
        expect(stats.totalGames).toBe(0);
    });

    it('should handle a scores array with one game correctly', () => {
        global.scores = [1]; // assuming 1 represents a win
        const stats = calculateStats();
        expect(stats.winPercentage).toBe('100');
        expect(stats.currentStreak).toBe(1);
        expect(stats.maxStreak).toBe(1);
        expect(stats.totalGames).toBe(1);
    });

    it('should calculate stats correctly even with non-binary scores', () => {
        global.scores = [5, 0, 3, 1, 0, 2]; // assuming non-zero represents a win
        const stats = calculateStats();
        expect(stats.winPercentage).toBe('67');
        expect(stats.currentStreak).toBe(1);
        expect(stats.maxStreak).toBe(2);
        expect(stats.totalGames).toBe(6);
    });
});
