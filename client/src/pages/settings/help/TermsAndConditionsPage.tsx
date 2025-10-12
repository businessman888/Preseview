import { ArrowLeftIcon } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export const TermsAndConditionsPage = (): JSX.Element => {
  return (
    <div className="flex flex-col h-screen bg-[#fdfdfa]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <Link href="/settings/help">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeftIcon className="w-6 h-6 text-[#5d5b5b]" />
          </Button>
        </Link>
        <h1 className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-xl">
          Termos e Políticas
        </h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <Tabs defaultValue="general" className="w-full">
          <div className="sticky top-0 bg-white border-b z-10">
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-white rounded-none h-auto p-2">
              <TabsTrigger value="general" className="whitespace-nowrap" data-testid="tab-general">
                Termos Gerais
              </TabsTrigger>
              <TabsTrigger value="uso" className="whitespace-nowrap" data-testid="tab-uso">
                Uso Aceitável
              </TabsTrigger>
              <TabsTrigger value="privacidade" className="whitespace-nowrap" data-testid="tab-privacidade">
                Privacidade
              </TabsTrigger>
              <TabsTrigger value="cookies" className="whitespace-nowrap" data-testid="tab-cookies">
                Cookies
              </TabsTrigger>
              <TabsTrigger value="moderacao" className="whitespace-nowrap" data-testid="tab-moderacao">
                Moderação
              </TabsTrigger>
              <TabsTrigger value="contrato" className="whitespace-nowrap" data-testid="tab-contrato">
                Contrato Fã-Criador
              </TabsTrigger>
              <TabsTrigger value="comunidade" className="whitespace-nowrap" data-testid="tab-comunidade">
                Comunidade
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4">
            {/* Termos e Condições Gerais */}
            <TabsContent value="general" data-testid="content-general">
              <Card className="p-6">
                <div className="prose prose-sm max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Termos e Condições Gerais</h2>
                  <p className="text-sm text-gray-500 mb-6">Atualizado: 12 de outubro de 2025</p>
                  
                  <div className="space-y-6 text-[#5d5b5b]">
                    <p className="font-semibold">
                      ESTE DOCUMENTO É UM ACORDO LEGAL VINCULANTE ENTRE VOCÊ E A PRESEVIEW HOLDINGS LTDA.
                    </p>
                    
                    <section>
                      <h3 className="text-xl font-semibold mb-3">Palavras e Definições Importantes</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Conta:</strong> Uma conta de Usuário única para um endereço de e-mail.</p>
                        <p><strong>Conteúdo:</strong> Qualquer texto, software, scripts, gráficos, fotos, sons, música, vídeos e outros materiais.</p>
                        <p><strong>Usuário Criativo:</strong> Um Usuário autorizado a registrar e gerenciar modelos gerados por IA como criadores de conteúdo.</p>
                        <p><strong>Plataforma:</strong> A plataforma Preseview fornecida no Site e quaisquer atualizações ou suplementos a ela.</p>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">1. Reconhecimentos</h3>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>A Preseview é de propriedade da Preseview Holdings Ltda, registrada no Brasil.</li>
                        <li>Pagamentos no Brasil são processados pela Preseview Holdings Ltda usando gateways como Pagar.me.</li>
                        <li>Podemos alterar estes termos a qualquer momento sem aviso.</li>
                        <li>Você é responsável por garantir que todas as pessoas que acessam a Plataforma através da sua conexão estejam cientes deste Acordo.</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">2. Sua Conta</h3>
                      <p className="text-sm mb-2">Para usar a Plataforma, você deve se registrar e criar uma Conta.</p>
                      <p className="text-sm mb-2">Ao criar uma Conta, você não deve:</p>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Se passar por outro indivíduo</li>
                        <li>Criar Contas 'bot' ou qualquer Conta controlada por meios automatizados</li>
                        <li>Compartilhar sua senha ou dar acesso à sua Conta para outros</li>
                        <li>Transferir sua Conta para qualquer outra pessoa</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">Contato</h3>
                      <p className="text-sm">
                        Se você tiver perguntas sobre qualquer de nossas políticas ou precisar de assistência, entre em contato através do suporte na plataforma.
                      </p>
                    </section>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Política de Uso Aceitável */}
            <TabsContent value="uso" data-testid="content-uso">
              <Card className="p-6">
                <div className="prose prose-sm max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Política de Uso Aceitável</h2>
                  <p className="text-sm text-gray-500 mb-6">Atualizado: 12 de outubro de 2025</p>
                  
                  <div className="space-y-6 text-[#5d5b5b]">
                    <section>
                      <h3 className="text-xl font-semibold mb-3">1. Uso Geral</h3>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Todos os Usuários devem acessar a Preseview apenas para fins legais e pessoais</li>
                        <li>Não vender, alugar, compartilhar ou transferir sua conta</li>
                        <li>Não tentar contornar restrições de segurança</li>
                        <li>Não se representar falsamente ou se passar por outros</li>
                        <li>Não perseguir, intimidar, abusar ou assediar qualquer pessoa</li>
                        <li>Não instigar ou se envolver em discurso de ódio</li>
                      </ul>
                      <p className="text-sm mt-3">
                        <strong>Importante:</strong> Usuários com menos de 18 anos estão proibidos de usar a Plataforma.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">2. Restrições de Conteúdo</h3>
                      
                      <h4 className="text-lg font-semibold mb-2 mt-4">Conduta Geral</h4>
                      <p className="text-sm mb-2">Não faça upload, compartilhe ou promova:</p>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Conteúdo ilegal, fraudulento ou que incentive violência</li>
                        <li>Conteúdo envolvendo pessoas menores de 18 anos</li>
                        <li>Conteúdo que você não possua direitos legais para distribuir</li>
                      </ul>

                      <h4 className="text-lg font-semibold mb-2 mt-4">Conteúdo Proibido</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Armas de fogo ou armas</li>
                        <li>Drogas ou parafernália de drogas</li>
                        <li>Conteúdo que promova automutilação ou suicídio</li>
                      </ul>

                      <h4 className="text-lg font-semibold mb-2 mt-4">Verificação de Identidade</h4>
                      <p className="text-sm mb-2"><strong>Criadores Reais:</strong></p>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Não use coberturas faciais que impeçam a verificação de identidade</li>
                        <li>Máscaras, véus ou qualquer vestimenta que obscureça características faciais são proibidos</li>
                        <li>A segurança e conformidade vêm em primeiro lugar</li>
                      </ul>
                      <p className="text-sm mt-2"><strong>Conteúdo Gerado por IA:</strong> Coberturas faciais são aceitáveis se claramente divulgado como IA</p>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">3. Segurança e Restrições Técnicas</h3>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Não contornar recursos de segurança da plataforma</li>
                        <li>Não usar software de bloqueio de anúncios</li>
                        <li>Não introduzir vírus ou material malicioso</li>
                        <li>Não usar processos automatizados (bots, scrapers)</li>
                        <li>Não usar VPNs para contornar restrições ou cometer fraude</li>
                      </ul>
                    </section>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Política de Privacidade */}
            <TabsContent value="privacidade" data-testid="content-privacidade">
              <Card className="p-6">
                <div className="prose prose-sm max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Política de Privacidade</h2>
                  <p className="text-sm text-gray-500 mb-6">Atualizado: 12 de outubro de 2025</p>
                  
                  <div className="space-y-6 text-[#5d5b5b]">
                    <section>
                      <h3 className="text-xl font-semibold mb-3">1. Quais Dados Coletamos</h3>
                      
                      <h4 className="text-lg font-semibold mb-2 mt-4">Dados que você fornece diretamente:</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Dados de identidade (nome, data de nascimento, nacionalidade)</li>
                        <li>Dados de contato (e-mail, telefone)</li>
                        <li>Dados de pagamento (cartão, banco, endereço de cobrança)</li>
                        <li>Documentos de verificação de Criadores (RG, verificações de vivacidade)</li>
                        <li>Comunicações (mensagens de suporte, reclamações)</li>
                      </ul>

                      <h4 className="text-lg font-semibold mb-2 mt-4">Dados que coletamos automaticamente:</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Dados de uso (horários de login, cliques, conteúdo visualizado)</li>
                        <li>Dados técnicos (endereço IP, tipo de navegador, modelo de dispositivo)</li>
                        <li>Dados de localização (baseados em IP)</li>
                        <li>Atividade de sessão</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">2. Como Usamos Seus Dados</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border p-2 text-left">Propósito</th>
                              <th className="border p-2 text-left">Base Legal</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border p-2">Criar e gerenciar sua Conta</td>
                              <td className="border p-2">Necessidade contratual</td>
                            </tr>
                            <tr>
                              <td className="border p-2">Verificar Criadores e garantir conformidade</td>
                              <td className="border p-2">Obrigação legal e interesse legítimo</td>
                            </tr>
                            <tr>
                              <td className="border p-2">Processar transações</td>
                              <td className="border p-2">Necessidade contratual</td>
                            </tr>
                            <tr>
                              <td className="border p-2">Prevenir abuso</td>
                              <td className="border p-2">Interesse legítimo e obrigação legal</td>
                            </tr>
                            <tr>
                              <td className="border p-2">Melhorar experiência</td>
                              <td className="border p-2">Interesse legítimo e/ou consentimento</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">3. Seus Direitos</h3>
                      <p className="text-sm mb-2">Você tem os seguintes direitos sob a LGPD:</p>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li><strong>Acesso:</strong> Solicitar uma cópia de seus dados pessoais</li>
                        <li><strong>Retificação:</strong> Corrigir dados imprecisos ou incompletos</li>
                        <li><strong>Esquecimento:</strong> Pedir que excluamos seus dados</li>
                        <li><strong>Restrição:</strong> Limitar como usamos seus dados</li>
                        <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                        <li><strong>Oposição:</strong> Parar certos tipos de processamento</li>
                        <li><strong>Retirar consentimento:</strong> Onde o processamento é baseado em consentimento</li>
                      </ul>
                      <p className="text-sm mt-3">
                        Para exercer seus direitos, entre em contato com support@preseview.com
                      </p>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">4. Segurança</h3>
                      <p className="text-sm">Implementamos medidas técnicas e organizacionais apropriadas:</p>
                      <ul className="list-disc pl-6 space-y-2 text-sm mt-2">
                        <li>Servidores seguros e criptografia de dados sensíveis</li>
                        <li>Restrições de acesso e acordos de confidencialidade para a equipe</li>
                        <li>Procedimentos de detecção e notificação de violações</li>
                      </ul>
                    </section>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Política de Cookies */}
            <TabsContent value="cookies" data-testid="content-cookies">
              <Card className="p-6">
                <div className="prose prose-sm max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Política de Cookies</h2>
                  <p className="text-sm text-gray-500 mb-6">Atualizado: 12 de outubro de 2025</p>
                  
                  <div className="space-y-6 text-[#5d5b5b]">
                    <section>
                      <h3 className="text-xl font-semibold mb-3">1. O Que São Cookies?</h3>
                      <p className="text-sm">
                        Cookies são pequenos arquivos de texto armazenados em seu dispositivo quando você visita um site. 
                        Eles ajudam a Plataforma a lembrar suas ações e preferências ao longo do tempo.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">2. Quais Cookies Usamos</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-lg font-semibold mb-2">Cookies Essenciais</h4>
                          <p className="text-sm">Necessários para o funcionamento básico da Plataforma (login, navegação). Não podem ser desativados.</p>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold mb-2">Cookies de Desempenho</h4>
                          <p className="text-sm">Coletam dados anônimos sobre como você usa a Plataforma para melhorar o desempenho.</p>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold mb-2">Cookies Funcionais</h4>
                          <p className="text-sm">Permitem funcionalidades como lembrar suas preferências (idioma, configurações).</p>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold mb-2">Cookies de Publicidade</h4>
                          <p className="text-sm">Usados para exibir anúncios relevantes, mas apenas com seu consentimento.</p>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">3. Gerenciando Suas Preferências</h3>
                      <p className="text-sm mb-2">Você pode controlar os cookies através das configurações de seu navegador:</p>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Bloquear ou excluir todos os cookies</li>
                        <li>Permitir apenas cookies essenciais</li>
                        <li>Configurar avisos antes de aceitar cookies</li>
                      </ul>
                      <p className="text-sm mt-3">
                        <strong>Nota:</strong> Desativar cookies essenciais pode afetar o funcionamento da Plataforma.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">4. Cookies de Terceiros</h3>
                      <p className="text-sm">
                        Trabalhamos com parceiros, como Google Analytics e redes de publicidade, que podem colocar seus próprios cookies. 
                        Esses cookies estão sujeitos às políticas de privacidade desses terceiros.
                      </p>
                    </section>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Política de Moderação */}
            <TabsContent value="moderacao" data-testid="content-moderacao">
              <Card className="p-6">
                <div className="prose prose-sm max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Política de Moderação e Proteção de Conteúdo</h2>
                  <p className="text-sm text-gray-500 mb-6">Atualizado: 12 de outubro de 2025</p>
                  
                  <div className="space-y-6 text-[#5d5b5b]">
                    <section>
                      <h3 className="text-xl font-semibold mb-3">1. Segurança do Usuário</h3>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Todos os Usuários devem confirmar ter 18 anos ou mais ao primeiro acesso</li>
                        <li>Se descobrirmos que um Usuário tem menos de 18 anos, sua conta será removida</li>
                        <li>Ferramentas automatizadas escaneiam todo o Conteúdo enviado</li>
                        <li>Conteúdo sinalizado é automaticamente desfocado até confirmação do usuário</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">2. KYC e Verificação de Identidade</h3>
                      <p className="text-sm mb-2">Qualquer Usuário que se candidate a Criador deve passar por verificação completa de KYC através do Ondato:</p>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Envio de documentos de identificação válidos</li>
                        <li>Verificação de vivacidade (captura de vídeo/foto em tempo real)</li>
                        <li>Confirmação de idade mínima de 18 anos</li>
                      </ul>
                      
                      <h4 className="text-lg font-semibold mb-2 mt-4">Revisões Manuais</h4>
                      <p className="text-sm mb-2">Conduzidas em:</p>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Todos os novos Criadores antes do primeiro saque</li>
                        <li>Criadores ganhando mais de R$ 500 em 24 horas</li>
                        <li>Padrões de comportamento suspeitos detectados</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">3. Processo de Moderação</h3>
                      <p className="text-sm mb-2">Todo conteúdo é automaticamente analisado por HIVE (IA de moderação), que sinaliza:</p>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Nudez ou atos explícitos</li>
                        <li>Armas, drogas ou atividades ilegais</li>
                        <li>Violência ou abuso</li>
                        <li>Classificação de idade baseada em características visíveis</li>
                        <li>Conteúdo gerado por IA</li>
                      </ul>
                      
                      <p className="text-sm mt-3">
                        <strong>SLA de Moderação:</strong> Revisamos todos os relatórios dentro de 48 horas. 
                        Casos urgentes (CSAM, impersonação) têm resposta em horas.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">4. Apelos e Revisão</h3>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Usuários podem solicitar apelo formal dentro de 7 dias</li>
                        <li>Apelos devem ser enviados via support@preseview.com</li>
                        <li>A maioria das decisões é emitida dentro de 7 dias</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">5. Proteção de Conteúdo</h3>
                      <p className="text-sm mb-2">Funcionalidades implementadas:</p>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Marca d'água</li>
                        <li>Prevenção de clique direito</li>
                        <li>Detecção de captura de tela</li>
                        <li>Análises de sessão para comportamento suspeito</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">6. Cooperação com Autoridades</h3>
                      <p className="text-sm">
                        A Preseview coopera com autoridades de aplicação da lei em resposta a relatórios de CSAM, 
                        tráfico humano, conteúdo não consensual e outros assuntos criminais.
                      </p>
                    </section>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Contrato Fã-Criador */}
            <TabsContent value="contrato" data-testid="content-contrato">
              <Card className="p-6">
                <div className="prose prose-sm max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Contrato Padrão Entre Fã e Criador</h2>
                  <p className="text-sm text-gray-500 mb-6">Atualizado: 12 de outubro de 2025</p>
                  
                  <div className="space-y-6 text-[#5d5b5b]">
                    <section>
                      <h3 className="text-xl font-semibold mb-3">Definições</h3>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li><strong>Fã:</strong> Usuário que faz pagamento para visualizar conteúdo do Criador</li>
                        <li><strong>Criador:</strong> Usuário que faz upload de conteúdo e concede licença à Preseview</li>
                        <li><strong>Pagamento do Fã:</strong> Pagamento feito pelo Fã à Preseview para acessar conteúdo</li>
                        <li><strong>Transação:</strong> Interação paga que resulte em licença de visualização</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">1. Estrutura de Licença</h3>
                      <p className="text-sm mb-2"><strong>Importante:</strong></p>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>A Preseview não é uma instituição de moeda eletrônica (EMI)</li>
                        <li>Fãs pagam à Preseview para receber uma licença limitada de visualização</li>
                        <li>O Criador concede à Preseview uma licença sublicenciável para distribuir o conteúdo</li>
                        <li>Criadores não são destinatários diretos dos Pagamentos dos Fãs</li>
                        <li>Todos os pagamentos são feitos à Preseview, que então paga os ganhos aos Criadores</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">2. Escopo da Licença do Fã</h3>
                      <p className="text-sm mb-2">Após pagamento, a Preseview concede ao Fã uma licença:</p>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Não exclusiva</li>
                        <li>Não transferível</li>
                        <li>Não sublicenciável</li>
                        <li>Revogável</li>
                        <li>Limitada a uso pessoal, não comercial</li>
                      </ul>
                      <p className="text-sm mt-3">
                        <strong>Nenhum direito de propriedade</strong> é transferido ao Fã.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">3. Expiração da Licença</h3>
                      <p className="text-sm mb-2">A licença expira imediatamente quando:</p>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>O pagamento for malsucedido ou revertido</li>
                        <li>A assinatura terminar (se não renovada)</li>
                        <li>A conta do Fã for terminada ou suspensa</li>
                        <li>O Fã violar a Política de Uso Aceitável</li>
                        <li>O Criador excluir o conteúdo</li>
                        <li>O Fã fechar sua conta</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">4. Obrigações do Fã</h3>
                      <p className="text-sm mb-2">O Fã concorda em:</p>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Usar o conteúdo apenas conforme permitido</li>
                        <li>Não copiar, compartilhar, gravar ou distribuir o conteúdo</li>
                        <li>Não contornar controles de segurança</li>
                        <li>Fazer todos os pagamentos de boa-fé</li>
                        <li>Não emitir chargebacks injustificados</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">5. Cancelamento e Reembolsos</h3>
                      <p className="text-sm">
                        Ao entrar em uma Transação, o Fã consente na oferta imediata de conteúdo digital e 
                        renuncia a direitos estatutários de cancelamento, exceto onde exigido por lei.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">6. Sem Garantias</h3>
                      <p className="text-sm mb-2">A Preseview não faz garantias quanto a:</p>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Acesso contínuo ao conteúdo</li>
                        <li>Frequência, qualidade ou volume de uploads</li>
                        <li>Compatibilidade com preferências ou dispositivos</li>
                      </ul>
                    </section>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Diretrizes da Comunidade */}
            <TabsContent value="comunidade" data-testid="content-comunidade">
              <Card className="p-6">
                <div className="prose prose-sm max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Diretrizes da Comunidade</h2>
                  <p className="text-sm text-gray-500 mb-6">Atualizado: 12 de outubro de 2025</p>
                  
                  <div className="space-y-6 text-[#5d5b5b]">
                    <section>
                      <h3 className="text-xl font-semibold mb-3">1. Padrões Gerais de Conteúdo</h3>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Faça upload apenas de conteúdo que tenha direito legal de postar</li>
                        <li>Não infrinja Direitos de Propriedade Intelectual de terceiros</li>
                        <li>Não viole leis aplicáveis</li>
                        <li>Não incite ou promova atividade ilegal</li>
                        <li>Não reposte conteúdo previamente removido</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">2. Discurso de Ódio e Discriminação</h3>
                      <p className="text-sm mb-2"><strong>Estritamente proibido:</strong></p>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Incentivo ou expressões desejando violência</li>
                        <li>Insultos destinados a degradar ou desumanizar</li>
                        <li>Conteúdo promovendo segregação ou exclusão</li>
                      </ul>
                      <p className="text-sm mt-3 font-semibold">
                        Política de tolerância zero. Violações resultam em remoção e possível banimento.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">3. Terrorismo e Extremismo</h3>
                      <p className="text-sm">
                        Conteúdo que promova, glorifique ou busque recrutar para ideologias terroristas ou 
                        extremistas é <strong>estritamente proibido</strong>. Sem exceções.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">4. Conteúdo Sexual Não Consensual</h3>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Qualquer conteúdo sem consentimento explícito é proibido</li>
                        <li>Mídia íntima capturada sem conhecimento do sujeito</li>
                        <li>Compartilhamento de conteúdo sexual não solicitado</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">5. Mídia Gerada por IA</h3>
                      <p className="text-sm mb-2">Permitido com as seguintes condições:</p>
                      
                      <h4 className="text-lg font-semibold mb-2 mt-4">Requisitos:</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li><strong>Divulgação:</strong> Toda mídia de IA deve ter divulgação clara (marca d'água, legenda)</li>
                        <li><strong>Sem Engano:</strong> Não pode ser enganoso ou prejudicial</li>
                        <li><strong>Restrições de Idade:</strong> Indivíduos gerados por IA não devem parecer menores</li>
                        <li><strong>Consentimento:</strong> Deepfakes exigem consentimento documentado</li>
                        <li><strong>Coberturas Faciais:</strong> Aceitáveis se claramente divulgado como IA</li>
                      </ul>
                      
                      <p className="text-sm mt-3">
                        <strong>Teste da Pessoa Razoável:</strong> Avaliado por pelo menos três moderadores.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">6. Conteúdo Explícito</h3>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Permitido, mas deve ser marcado como "Conteúdo 18+" ou "NSFW"</li>
                        <li>Não fornecer a menores de 18 anos</li>
                        <li>Não fazer upload de conteúdo envolvendo menores</li>
                        <li>Reter documentação de verificação de idade (USC 2257)</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">7. Privacidade e Informações Pessoais</h3>
                      <p className="text-sm mb-2">Não publique informações pessoais de outros sem consentimento:</p>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Nomes reais</li>
                        <li>Endereços</li>
                        <li>Informações de local de trabalho</li>
                        <li>Informações de contato</li>
                      </ul>
                      <p className="text-sm mt-2">Isso inclui tentativas de "doxxing".</p>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">8. Impersonação</h3>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Não se passar por outros indivíduos ou figuras públicas</li>
                        <li>Paródia permitida se claramente rotulada</li>
                        <li>Contas de paródia não devem ser enganosas</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">9. Conteúdo e Comportamento Ilegais</h3>
                      <p className="text-sm mb-2"><strong>Proibido:</strong></p>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Conteúdo promovendo bens ou serviços ilegais</li>
                        <li>Conteúdo sexual envolvendo menores</li>
                        <li>Conteúdo promovendo suicídio ou automutilação</li>
                        <li>Bullying, intimidação ou ameaças</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold mb-3">10. Requisitos de Comportamento</h3>
                      <p className="text-sm mb-2">Os Usuários concordam em:</p>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Não se envolver em tráfico humano ou exploração</li>
                        <li>Não hackear ou manipular a Plataforma</li>
                        <li>Não usar para fins comerciais ilegais</li>
                        <li>Não infringir direitos de propriedade intelectual</li>
                      </ul>
                    </section>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
