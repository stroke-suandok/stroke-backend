export type SingleGraphQLResponse<ResponseData> = {
    body: {
        kind: 'single';
        singleResult: {
            data: ResponseData;
        };
    };
};

export function getRandomElement<T>(array: T[]) {
    return array[Math.floor(Math.random() * array.length)];
}

export function getRandomDepartment() {
    const departments = ['ER', 'OR', 'LAB', 'ANY'];
    return getRandomElement(departments);
}

export function getRandomRole() {
    const roles = ['SUPER_ADMIN', 'ADMIN', 'USER'];
    return getRandomElement(roles);
}

export function getRandomTitle() {
    const titles = ['Dr', 'Mr', 'Mrs', 'Ms'];
    return getRandomElement(titles);
}

export function getRandomEntry() {
    const entries = ['WALKIN', 'REFER'];
    return getRandomElement(entries);
}
