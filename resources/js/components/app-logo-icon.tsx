import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M11 34V14a2 2 0 0 1 2-2h5l13 17V14a2 2 0 0 1 2-2h4v22a2 2 0 0 1-2 2h-5L17 19v15a2 2 0 0 1-2 2h-4z"
                fill="currentColor"
            />
        </svg>
    );
}
