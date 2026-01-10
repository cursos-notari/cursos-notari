"use client"

import { Collapse } from "@geist-ui/core";

export default function Modules() {
  return (
    <div>
      <h3 className="text-gray-600 font-medium delay-small-reveal mb-3">
        Módulos
      </h3>
      <Collapse.Group className="px-0!">
        <Collapse style={{ fontSize: '13px', fontWeight: 500, color: '#292524' }} className="interval-card-reveal" title="Fundamentos da Refrigeração">
          <p className="text-gray-800 text-base font-medium">
            Como o sistema remove calor dos ambientes,
            identificando os elementos e o caminho percorrido pelo fluido refrigerante.
          </p>
        </Collapse>

        <Collapse style={{ fontSize: '13px', fontWeight: 500, color: '#292524' }} className="interval-card-reveal" title="Ferramentas e Equipamentos de Trabalho">
          <p className="text-gray-800 text-base font-medium">
            Reconhecimento, manuseio e conservação dos principais
            instrumentos utilizados em serviços de refrigeração e climatização.
          </p>
        </Collapse>

        <Collapse style={{ fontSize: '13px', fontWeight: 500, color: '#292524' }} className="interval-card-reveal" title="Boas Práticas de Instalação">
          <p className="text-gray-800 text-base font-medium">
            Planejamento de instalações corretas,
            evitando erros que comprometem o desempenho do equipamento ou geram riscos.
          </p>
        </Collapse>

        <Collapse style={{ fontSize: '13px', fontWeight: 500, color: '#292524' }} className="interval-card-reveal" title="Fundamentos da Refrigeração">
          <p className="text-gray-800 text-base font-medium">
            Processo completo de instalação com base na prática
            e na organização do serviço técnico.
          </p>
        </Collapse>

        <Collapse style={{ fontSize: '13px', fontWeight: 500, color: '#292524' }} className="interval-card-reveal" title="Ferramentas e Equipamentos de Trabalho">
          <p className="text-gray-800 text-base font-medium">
            Como realizar diagnósticos e operações de carga/recarga com precisão, garantindo o desempenho correto do sistema.
          </p>
        </Collapse>

        <Collapse style={{ fontSize: '13px', fontWeight: 500, color: '#292524' }} className="interval-card-reveal" title="Boas Práticas de Instalação">
          <p className="text-gray-800 text-base font-medium">
            Como entregar um serviço completo, limpo, seguro e confiável, elevando a reputação técnica e a satisfação do cliente.
          </p>
        </Collapse>
      </Collapse.Group>
    </div>
  );
}