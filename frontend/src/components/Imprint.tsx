import { Section } from './ContainerElements';
import { HeadlineHP, ParagraphHP } from './TextElements';

export default function Imprint() {
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
                    Impressum
                </HeadlineHP>

                <ParagraphHP marginTop="3rem">Angaben gemäß § 5 DDG</ParagraphHP>

                <ParagraphHP>
                    Max Muster - Musterberuf
                    <br />
                    c/o Beispielbüro
                    <br />
                    Musterweg
                    <br />
                    12345 Musterstadt
                    <br />
                </ParagraphHP>

                <ParagraphHP>
                    <em>Vertreten durch:</em>
                    <br />
                    Max Muster
                </ParagraphHP>

                <ParagraphHP>
                    <em>Kontakt:</em>
                    <br />
                    Telefon: 01234-789456
                    <br />
                    Fax: 1234-56789
                    <br />
                    E-Mail: max@muster.de
                    <br />
                </ParagraphHP>

                <ParagraphHP>
                    <em>Umsatzsteuer-ID:</em>
                    <br />
                    Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz: Musterustid.
                </ParagraphHP>

                <ParagraphHP>
                    <em>Haftungsausschluss:</em>
                    <br />
                    <br />
                    <em>Haftung für Inhalte</em>
                    <br />
                    Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die
                    Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine
                    Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene
                    Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§
                    8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet,
                    übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach
                    Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                    Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach
                    den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung
                    ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
                    möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir
                    diese Inhalte umgehend entfernen.
                </ParagraphHP>

                <ParagraphHP>
                    <em>Haftung für Links</em>
                    <br />
                    Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir
                    keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine
                    Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
                    Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden
                    zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
                    Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine
                    permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
                    Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
                    Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                </ParagraphHP>

                <ParagraphHP>
                    <em>Urheberrecht</em>
                    <br />
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
                    unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
                    Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes
                    bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                    Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen
                    Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber
                    erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden
                    Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine
                    Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden
                    Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte
                    umgehend entfernen.
                </ParagraphHP>

                <ParagraphHP>
                    <em>Google Analytics</em>
                    <br />
                    Diese Website benutzt Google Analytics, einen Webanalysedienst der Google Inc.
                    (''Google''). Google Analytics verwendet sog. ''Cookies'', Textdateien, die auf
                    Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website
                    durch Sie ermöglicht. Die durch den Cookie erzeugten Informationen über Ihre
                    Benutzung dieser Website (einschließlich Ihrer IP-Adresse) wird an einen Server
                    von Google in den USA übertragen und dort gespeichert. Google wird diese
                    Informationen benutzen, um Ihre Nutzung der Website auszuwerten, um Reports über
                    die Websiteaktivitäten für die Websitebetreiber zusammenzustellen und um weitere
                    mit der Websitenutzung und der Internetnutzung verbundene Dienstleistungen zu
                    erbringen. Auch wird Google diese Informationen gegebenenfalls an Dritte
                    übertragen, sofern dies gesetzlich vorgeschrieben oder soweit Dritte diese Daten
                    im Auftrag von Google verarbeiten. Google wird in keinem Fall Ihre IP-Adresse
                    mit anderen Daten der Google in Verbindung bringen. Sie können die Installation
                    der Cookies durch eine entsprechende Einstellung Ihrer Browser Software
                    verhindern; wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall
                    gegebenenfalls nicht sämtliche Funktionen dieser Website voll umfänglich nutzen
                    können. Durch die Nutzung dieser Website erklären Sie sich mit der Bearbeitung
                    der über Sie erhobenen Daten durch Google in der zuvor beschriebenen Art und
                    Weise und zu dem zuvor benannten Zweck einverstanden.
                </ParagraphHP>

                <ParagraphHP>
                    Impressum von{' '}
                    <a href="https://websitewissen.com" rel="dofollow">
                        WebsiteWissen.com
                    </a>
                    , dem Ratgeber für{' '}
                    <a href="https://websitewissen.com/wordpress-website-erstellen" rel="dofollow">
                        WordPress-Websites
                    </a>
                    ,{' '}
                    <a href="https://websitewissen.com/wordpress-hosting-vergleich" rel="dofollow">
                        WordPress-Hosting
                    </a>{' '}
                    und{' '}
                    <a href="https://websitewissen.com/website-kosten" rel="dofollow">
                        Website-Kosten
                    </a>{' '}
                    nach einem Muster von{' '}
                    <a href="https://www.kanzlei-hasselbach.de/" rel="dofollow">
                        Kanzlei Hasselbach Rechtsanwälte
                    </a>
                    .
                </ParagraphHP>
            </Section>
        </>
    );
}
