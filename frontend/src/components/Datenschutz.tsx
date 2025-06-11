import { Link as MuiLink } from '@mui/material';
import { testId } from '../utils/testId';
import { Section } from './ContainerElements';
import RouterLinkWrapper from './RouterLink';
import { HeadlineHP, ParagraphHP } from './TextElements';

export default function Datenschutz() {
    return (
        <>
            <Section textAlign="left" background="rgba(255,255,255, 1)" color="rgba(33,29,29, 1)">
                <HeadlineHP
                    variant="h1"
                    component="h1"
                    marginBottom="1rem"
                    fontWeight={300}
                    textAlign="left"
                >
                    Datenschutzerklärung
                </HeadlineHP>

                <ParagraphHP>
                    <em>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</em>
                    <br />
                    Suk-Be Jang - Privatperson
                    <br />
                    Compesstr. 2
                    <br />
                    50769 Köln
                    <br />
                    E-Mail: volldoll(ätt)sokdesign.de
                    <br />
                    <MuiLink
                        component={RouterLinkWrapper}
                        href="/impressum"
                        sx={{ textDecoration: 'none' }}
                        {...testId('link-datenschutz-impressum-page')}
                    >
                        Website Impressum
                    </MuiLink>
                </ParagraphHP>

                <ParagraphHP>
                    <em>Erhebung und Speicherung personenbezogener Daten</em>
                    <br />
                    Beim Besuch und bei der Nutzung dieser Website erfassen wir personenbezogene
                    Daten nur,
                    <br />
                    wenn Sie sich registrieren oder anmelden.
                    <br />
                    <br />
                    Dabei handelt es sich um technisch notwendige Daten
                </ParagraphHP>

                <ul>
                    <li>damit geschütze Seiten angezeigt werden können</li>
                    <li>Sie sicher surfen und Einstellungen an der Seite speichern können</li>
                    <li>und ein Login/Logout Prozess möglich ist.</li>
                </ul>

                <ParagraphHP>
                    <em>Gespeicherte personenbezogene Daten können sein:</em>
                </ParagraphHP>
                <ul>
                    <li>Name</li>
                    <li>E-Mail-Adresse</li>
                    <li>Avatarbild (Profilbild)</li>
                </ul>
                <ParagraphHP>Diese Daten werden entweder:</ParagraphHP>
                <ul>
                    <li>
                        durch manuelle Eingabe durch Sie selbst bei der Registrierung oder in Ihrem
                        Benutzerprofil eingegeben oder
                    </li>
                    <li>
                        automatisch übermittelt durch die Anmeldung über Drittanbieter (z. B. Google
                        oder GitHub) mittels OAuth-Verfahren.
                    </li>
                </ul>
                <ParagraphHP>
                    Die Daten werden in unserer Datenbank gespeichert und zur Verwaltung Ihres
                    Benutzerkontos sowie zur Speicherung Ihrer individuellen Einstellungen
                    verwendet.
                    <br />
                    <br />
                </ParagraphHP>

                <ParagraphHP>
                    <em>Weitergabe der Daten</em>
                    <br />
                    Es erfolgt keine Weitergabe Ihrer Daten an Dritte.
                    <br />
                    <br />
                    Wenn die Authentifizierung über Google oder Github erfolgt gelten zusätzliche
                    Datenschutzerklärungen:
                </ParagraphHP>

                <ul>
                    <li>
                        Google OAuth (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4,
                        Irland) Datenschutzerklärung:{' '}
                        <a
                            href="https://policies.google.com/privacy"
                            target="_blank"
                            style={{ color: 'hsl(148, 100%, 61%)', textDecoration: 'none' }}
                            rel="noopener noreferrer"
                            {...testId('link-google-privacy-page')}
                        >
                            https://policies.google.com/privacy
                        </a>
                    </li>
                    <li>
                        GitHub OAuth (GitHub Inc., 88 Colin P Kelly Jr St, San Francisco, CA 94107,
                        USA) Datenschutzerklärung:{' '}
                        <a
                            href="https://docs.github.com/en/github/site-policy/github-privacy-statement"
                            target="_blank"
                            style={{ color: 'hsl(148, 100%, 61%)', textDecoration: 'none' }}
                            rel="noopener noreferrer"
                            {...testId('link-github-privacy-page')}
                        >
                            https://docs.github.com/en/github/site-policy/github-privacy-statement
                        </a>
                    </li>
                    <li>
                        Es kann dabei eine Übermittlung in Drittländer (z. B. USA) stattfinden.
                        Diese Anbieter unterliegen den Standardvertragsklauseln der EU-Kommission.
                    </li>
                </ul>

                <ParagraphHP>
                    <em>Speicherdauer</em>
                    <br />
                    Ihre personenbezogenen Daten werden solange gespeichert, wie Ihr Benutzerkonto
                    aktiv ist. Auf Wunsch löschen wir Ihre Daten jederzeit vollständig.
                </ParagraphHP>

                <ParagraphHP>
                    <em>Ihre Rechte</em>
                    <br />
                    Sie haben nach DSGVO folgende Rechte:
                </ParagraphHP>

                <ul>
                    <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
                    <li>Berichtigung falscher Daten (Art. 16 DSGVO)</li>
                    <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
                    <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                    <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
                    <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                    <li>Beschwerderecht bei der zuständigen Aufsichtsbehörde</li>
                </ul>
                <ParagraphHP>
                    <em>Zuständige Aufsichtsbehörde:</em>
                    <br />
                    Der Landesbeauftragte für den Datenschutz Ihres Bundeslandes{' '}
                    <a
                        href="https://www.bfdi.bund.de/DE/Service/Anschriften/Laender/Laender-node.html"
                        target="_blank"
                        style={{ color: 'hsl(148, 100%, 61%)', textDecoration: 'none' }}
                        rel="noopener noreferrer"
                        {...testId('link-liste-aufsichtsbehoerde-page')}
                    >
                        Liste der Aufsichtsbehörden in Deutschland (BfDI)
                    </a>
                </ParagraphHP>

                <ParagraphHP>
                    <em>Sicherheit</em>
                    <br />
                    Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten vor
                    unberechtigtem Zugriff zu schützen. Die Authentifizierung und Datenübertragung
                    erfolgt über verschlüsselte Verbindungen (HTTPS, Laravel Sanctum).
                </ParagraphHP>

                <ParagraphHP>
                    <em>Änderungen dieser Datenschutzerklärung</em>
                    <br />
                    Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte
                    Rechtslagen oder bei Änderungen der Datenverarbeitung anzupassen. Die jeweils
                    aktuelle Version ist auf dieser Seite abrufbar.
                </ParagraphHP>

                <ParagraphHP>
                    <em>Kontakt</em>
                    <br />
                    Bei Fragen zur Verarbeitung Ihrer personenbezogenen Daten wenden Sie sich bitte
                    an: volldoll(ätt)sokdesign.de
                </ParagraphHP>
            </Section>
        </>
    );
}
