"use client"

import { Collapse, Text } from "@geist-ui/core";
import styles from "./learning.module.css"
import clsx from "clsx";

export default function Modules() {
  return (
    <>
      <Collapse.Group>
        <h5 style={{ marginBottom: '2%' }} className={clsx('delay-medium-reveal bold', styles.label)}>
          Módulos
        </h5>
        <div className={styles.containerDivider}>
          <h5 className={clsx("emphasis text-sky-600 delay-small-reveal", styles.label)}>
            Primeiro dia
          </h5><hr className="delay-small-reveal" />
        </div>

        <Collapse className="interval-card-reveal regular" title="1 – Fundamentos da Refrigeração">
          <Text className={styles.collapseContent}>
            Como o sistema remove calor dos ambientes,
            identificando os elementos e o caminho percorrido pelo fluido refrigerante.
          </Text>
        </Collapse>

        <Collapse className="interval-card-reveal regular" title="2 – Ferramentas e Equipamentos de Trabalho">
          <Text className={styles.collapseContent}>
            Reconhecimento, manuseio e conservação dos principais
            instrumentos utilizados em serviços de refrigeração e climatização.
          </Text>
        </Collapse>

        <Collapse className={clsx(styles.collapse, "interval-card-reveal regular")} title="3 – Boas Práticas de Instalação">
          <Text className={styles.collapseContent}>
            Planejamento de instalações corretas,
            evitando erros que comprometem o desempenho do equipamento ou geram riscos.
          </Text>
        </Collapse>

        <div className={styles.containerDivider}>
          <h5 className={clsx("emphasis text-sky-600 delay-small-reveal", styles.label)}>
            Segundo dia
          </h5><hr className="delay-small-reveal" />
        </div>

        <Collapse className="interval-card-reveal regular" title="4 – Fundamentos da Refrigeração">
          <Text className={styles.collapseContent}>
            Processo completo de instalação com base na prática
            e na organização do serviço técnico.
          </Text>
        </Collapse>

        <Collapse className="interval-card-reveal regular" title="5 – Ferramentas e Equipamentos de Trabalho">
          <Text className={styles.collapseContent}>
            Como realizar diagnósticos e operações de carga/recarga com precisão, garantindo o desempenho correto do sistema.
          </Text>
        </Collapse>

        <Collapse className="interval-card-reveal regular" title="6 – Boas Práticas de Instalação">
          <Text className={styles.collapseContent}>
            Como entregar um serviço completo, limpo, seguro e confiável, elevando a reputação técnica e a satisfação do cliente.
          </Text>
        </Collapse>
      </Collapse.Group>
    </>
  );
}