import { render, screen } from '@testing-library/react'
import Portal from '@/app/portal/page'

describe('User Portal',()=>{
    test('Checking navbar loads',()=>{
        render(<Portal />);
        expect(screen.getByAltText('blueprint logo',{exact:false})).toBeInTheDocument();
    });

    test('Checking headings load',()=>{
        render(<Portal />);
        
        expect(screen.getByRole('heading',{name:'Welcome'})).toBeInTheDocument();
        expect(screen.getByRole('heading',{name:'Your Websites'})).toBeInTheDocument();
    });

    test('Checking buttons load',()=>{
        render(<Portal />);

        expect(screen.getByRole('button',{name:'Website'})).toBeInTheDocument();
        expect(screen.getByRole('link',{name:'Website'})).toHaveProperty('href', window.location.href+'canvas');

        expect(screen.getByRole('button',{name:'Website Backend'})).toBeInTheDocument();
        expect(screen.getByRole('link',{name:'Website Backend'})).toHaveProperty('href',window.location.href+'userwebbackend');

        expect(screen.getByRole('button',{name:'Website Details'})).toBeInTheDocument();
        expect(screen.getByRole('link',{name:'Website Details'})).toHaveProperty('href',window.location.href+'admin-account-view');
    });

    test('Checking table loads',()=>{
        render(<Portal />);

        expect(screen.getByRole('rowgroup')).toBeInTheDocument();
        expect(screen.getByRole('row',{name:'Website Preview image Statistics Website'})).toBeInTheDocument();
        expect(screen.getByRole('row',{name:'Status Website Backend'})).toBeInTheDocument();
        expect(screen.getByRole('row',{name:'Description Website Details'})).toBeInTheDocument();

        expect(screen.getByRole('columnheader',{name:'Website Preview image'})).toBeInTheDocument();
        
//TODO: if/when the table's properties are moved to a css file, or the preview image is no longer text, these will cause a failure
        expect(screen.getByRole('columnheader',{name:'Website Preview image'})).toHaveProperty('align','center');
        expect(screen.getByRole('columnheader',{name:'Website Preview image'})).toHaveProperty('className','tableHeader');
        expect(screen.getByRole('columnheader',{name:'Website Preview image'})).toHaveProperty('rowSpan',3);

        const cells = ['Statistics','Website','Status','Website Backend','Description','Website Details'];
        for(const i in cells){ //that every cell in the table is loaded
            expect(screen.getByRole('cell',{name:cells[i]})).toBeInTheDocument();
            expect(screen.getByRole('cell',{name:cells[i]})).toHaveProperty('className','tableData');
        }
    });
});