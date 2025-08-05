import Button from '@/componentsTemplateEngine/buttons/Button';
import { testId } from '@/utils/testId';
import { Link } from 'react-router-dom';
import LayoutExampleTeaser from './LayoutExampleTeaser';

const ExampleTeaser = () => {
    return (
        <div {...testId('layout-example-teaser')}>
            <h2 className="text-lg font-bold pt-4">Layout Example Grids</h2>
            <Link to="/template-engine/presets" className="group">
                <LayoutExampleTeaser />

                <Button
                    className="mb-4 text-center bg-gray-light text-white shadow-inner shadow-white/50 group-focus:outline-none group-hover:bg-gray-dark  group-hover:text-green group-open:bg-gray-dark/700 group-focus:outline-1 group-focus:outline-white"
                    {...testId('button-example-teaser')}
                >
                    Browse Examples
                </Button>
            </Link>
        </div>
    );
};

export default ExampleTeaser;
