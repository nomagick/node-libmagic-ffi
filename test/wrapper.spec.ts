import { LibmagicIO } from '..';
import path from 'path';
import fs from 'fs';

describe('Wrapper with pool', () => {
    expect(LibmagicIO).toBeDefined();
    const globalInstance = new LibmagicIO({ returnContentType: true });
    expect(globalInstance).toBeInstanceOf(LibmagicIO);

    beforeAll(async () => {
        await globalInstance.getLibmagicVersion();
    });

    it('Loads', async () => {
        await expect(globalInstance.getLibmagicVersion()).resolves.toBeGreaterThanOrEqual(0);
    });

    it('Can open, load, close', async () => {
        const instance = new LibmagicIO();
        expect(instance).toBeInstanceOf(LibmagicIO);
        await expect(instance.getLibmagicVersion()).resolves.toBeGreaterThanOrEqual(0);
        await expect(instance.close()).resolves;
    });

    it('Can detect json file', async () => {
        const instance = new LibmagicIO({
            returnContentType: true
        });
        const r = instance.detectFile(path.resolve(__dirname, '..', 'package.json'));
        await expect(r).resolves.toContain('application/json');
    });

    it('Can detect json buffer', async () => {
        const instance = globalInstance;
        const jsonPath = path.resolve(__dirname, '..', 'package.json');
        const buff = fs.readFileSync(jsonPath);
        const r = instance.detectBuffer(buff);
        await expect(r).resolves.toContain('application/json');
    });

    it('Can detect json file concurrently', async () => {
        const instance = globalInstance;
        const jsonPath = path.resolve(__dirname, '..', 'package.json');
        const buff = fs.readFileSync(jsonPath);
        const r1 = instance.detectFile(jsonPath);
        const r2 = instance.detectBuffer(buff);
        const r3 = instance.detectFile(jsonPath);
        const r4 = instance.detectBuffer(buff);
        await Promise.all([
            expect(r1).resolves.toContain('application/json'),
            expect(r2).resolves.toContain('application/json'),
            expect(r3).resolves.toContain('application/json'),
            expect(r4).resolves.toContain('application/json'),
        ]);
    });
});
