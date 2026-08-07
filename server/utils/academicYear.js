export const getCurrentAcademicYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed, 0 = Jan, 3 = April

    if (month >= 3) {
        // April or later
        return `${year}-${(year + 1).toString().slice(-2)}`;
    } else {
        // Before April
        return `${year - 1}-${year.toString().slice(-2)}`;
    }
};
