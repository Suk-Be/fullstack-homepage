import Button from '@/componentsTemplateEngine/buttons/Button';
import { Link } from 'react-router-dom';
import GridExampleTeaser from './ExampleTeaser';

const ExampleTeaser = () => {
    return (
        <aside data-testid="layout-presets-teaser">
            <h2 className="text-lg font-bold pt-4">Layout Example Grids</h2>
            <Link to="/template-engine/presets" className="group">
                <GridExampleTeaser />

                <Button
                    className="
                    mb-4 text-center 
                    bg-gray-light 
                    text-white 
                    shadow-inner shadow-white/50
                    group-focus:outline-none 
                    group-hover:bg-gray-dark 
                    group-hover:text-green
                    group-open:bg-gray-dark/700 
                    group-focus:outline-1 
                    group-focus:outline-white"
                >
                    Browse Examples
                </Button>
            </Link>
        </aside>
    );
};

export default ExampleTeaser;
