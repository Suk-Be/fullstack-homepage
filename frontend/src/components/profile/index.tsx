import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { testId } from '../../utilitites/testId';
import { Section, SectionRelative } from '../ContainerElements';
import { Claim, Logo, ParagraphHP } from '../TextElements';
import ProfilePic from './ProfilePicture';
import RibbonLayout from './Ribbon';

type Props = {
    profile: {
        id: number;
        type: 'profile';
        attributes: {
            title: string;
            description: string;
            image: string;
        };
    };
};

const ProfileHP = ({ profile }: Props) => {
    const sanitizedData = DOMPurify.sanitize(profile.attributes.description);

    return (
        <>
            <Section textAlign="center" paddingTop="7rem" paddingTopMd="7rem">
                <Logo component="h1" {...testId('headline-logo-home-page')} />
                <Claim {...testId('profile-claim-home-page')}>(Web Developer)</Claim>
                <ProfilePic
                    imgSrc={profile.attributes.image!}
                    {...testId('profile-pic-home-page')}
                />
            </Section>
            <SectionRelative paddingBottom="3rem">
                <RibbonLayout variant="h2" component="h2" {...testId('subtitle-home-page')}>
                    {profile.attributes.title}
                </RibbonLayout>
                <ParagraphHP marginTop="3rem">{parse(sanitizedData)}</ParagraphHP>
            </SectionRelative>
        </>
    );
};

export default ProfileHP;
