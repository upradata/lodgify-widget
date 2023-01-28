import React, { useMemo, useState } from 'react';
import { Viewport } from '@lodgify/ui';
import './App.css';
import { RoomsSearch } from './components/RoomsSearch';
import { BreakPoints } from './components/MediaQuery/BreakPoints';


// window.global = { process: { env: {} } as any } as any; // NodeJS.ProcessEnv
// window.global.process.env.WEBSITES_SERVICE_HOST = 'thomas-milotti.lodgify.com';
// window.global.process.env.WEBSITES_SERVICE_URL = 'thomas-milotti.lodgify.com';

// import('@lodgify/websites-service-client').then(({ getAvailability }) => {

const App: React.FunctionComponent = () => {
    const [ count, setCount ] = useState(0);
    /* setInterval(() => setCount(prev => {
        console.log({ prev });
        return prev + 1;
    }), 1000); */
    /*  setInterval(() => setCount(count+1), 1000); */

    return <div className="App">
        {/* <MediaQuery
            onActive={bp => console.log('isAcitve', bp)}
            onInactive={bp => console.log('isInacitve', bp)}
            breakpoints={[
                {
                    max: 599,
                    className: 'class-599<=',
                    onActive: () => { console.log('isAcitve 599<='); },
                    onInactive: () => { console.log('isInacitve 599<='); },
                    children: () => <div>{'599<= is active'}</div>
                },
                {
                    min: 600,
                    className: 'class-600>',
                    onActive: () => { console.log('isAcitve 600>'); },
                    onInactive: () => { console.log('isInacitve 600>'); },
                    children: () => <div>{'600> is active'}</div>
                },
                {
                    min: 600,
                    max: 1200,
                    className: 'class-<600-1200<=',
                    onActive: () => { console.log('isAcitve <600-1200<='); },
                    onInactive: () => { console.log('isInacitve <600-1200<='); },
                    children: () => <div>{'<600-1200<= is active'}</div>
                },
                {
                    min: 1201,
                    className: 'class-1201>',
                    onActive: () => { console.log('isAcitve 1201>'); },
                    onInactive: () => { console.log('isInacitve 1201>'); },
                    children: () => <div>{'1201> is active'}</div>
                }
            ]}
        >

            <span>Always Visible</span>
        </MediaQuery>

        <BreakPoint max={599} className="class-599<=" onActive={() => { console.log('isAcitve 599<='); }} onInactive={() => { console.log('isInacitve 599<='); }}>
            <div>{'599<= is active'}</div>
        </BreakPoint>

        <BreakPoint min={600} className="class-600>" onActive={() => { console.log('isAcitve 600>'); }} onInactive={() => { console.log('isInacitve 600>'); }}>
            {() => <div>{'600> is active'}</div>}
        </BreakPoint>

        <BreakPoint min={600} max={1200} className="600-1200<=" onActive={() => { console.log('isAcitve 600-1200<='); }} onInactive={() => { console.log('isInacitve 599<='); }}>
            <div>{'600-1200<= is active'}</div>
        </BreakPoint>

        <BreakPoint min={1201} className="class-1201>" onActive={() => { console.log('isAcitve 1201>'); }} onInactive={() => { console.log('isInacitve 1201>'); }}>
            <div>{'51201> is active'}</div>
        </BreakPoint> */}
        {/*  <button onClick={() => setCount(count + 1)}>Click</button>
        <BreakPoints breakpoints={useMemo(() => [ 0, 600, 800, 1000, 1200 ], [])} mode="min" parentProps={count}>
            {(bp, count: number) => <div>Breakpoint test {JSON.stringify(bp)} count: {count}</div>}
        </BreakPoints> */}

        <Viewport>
            <RoomsSearch />
        </Viewport>
    </div >;
};

App.displayName = 'App';

export default App;
