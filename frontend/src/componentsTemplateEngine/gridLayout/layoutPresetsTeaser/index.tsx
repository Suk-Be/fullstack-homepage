import Button from '../../buttons/Button';
import Divider from '../../gridConfiguration/Divider';
import GridTeaserElement from './GridTeaserElement';

const LayoutPresetsTeaser = () => {
    return (
        <aside data-testid="layout-presets-teaser">
            <h2 className="text-lg font-bold pt-4">Layout Presets</h2>
            <a href="/layouts/presets" className="group">
                <GridTeaserElement />

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
                    Browse Presets
                </Button>
            </a>

            <Divider className="my-4" />
        </aside>
    );
};

export default LayoutPresetsTeaser;
