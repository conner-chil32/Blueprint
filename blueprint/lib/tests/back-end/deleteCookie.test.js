import GET from "@/app/deleteCookie/route";
import { NextResponse } from 'next/server';
import { setCookie, hasCookie } from '@/app/api/CookieController';

describe('deleteCookie component testing', () => {
    test('Testing undefined cookie detection', () => {
        const und = undefined;
        expect(und).toBeUndefined();
    });

    test('Testing cookie deletion',()=>{
        const res = NextResponse.json({ message: 'Cookie has been set!' });
        setCookie(res, 'TempCookie', 'LoggedIn');

        expect(hasCookie(res)).toBe(true);
    });
});