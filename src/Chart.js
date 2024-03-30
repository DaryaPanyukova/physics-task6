import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import {xcenter} from "plotly.js/src/components/shapes/label_texttemplate";

const Chart = () => {
    const [inductance, setInductance] = useState(1);
    const [resistance, setResistance] = useState(1);
    const [capacitance, setCapacitance] = useState(1);
    const [charge , setCharge] = useState(1);
    const [layout] = useState({
        width: 800,
        height: 400,
        xaxis: { title: 'Время (с)' },
        yaxis: { title: 'Заряд (Кл)' },
        title: "График зависимости заряда от времени",
    });
    const [secondLayout] = useState({
        width: 800,
        height: 400,
        xaxis: { title: 'Время (с)' },
        yaxis: { title: 'Напряжение (В)' },
        title: "График зависимости напряжения от времени",
    });
    const [thirdLayout] = useState({
        width: 800,
        height: 400,
        xaxis: { title: 'Время (с)' },
        yaxis: { title: 'Сила тока (А)' },
        title: "График зависимости силы тока от времени",
    });

    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const updateResistance = (newResistance) => {
        if (newResistance <= 0 || newResistance > 2 * Math.sqrt(inductance / capacitance)) {
            handleShowModal();
        } else {
            setResistance(newResistance);
        }
    }
    const updateInductance = (newInductance) => {
        if (newInductance <= 0 || resistance > 2 * Math.sqrt(newInductance / capacitance)) {
            handleShowModal();
        } else {
            setInductance(newInductance);
        }
    }
    const updateCapacitance = (newCapacitance) => {
        if (newCapacitance <= 0 || resistance > 2 * Math.sqrt(inductance / newCapacitance)) {
            handleShowModal();
        } else {
            setCapacitance(newCapacitance);
        }
    }

    const beta = resistance / (2*inductance);
    const w0 = 1 / Math.sqrt(inductance * capacitance);
    const I_max = w0 * charge;
    const xValuesQ = Array.from({ length: 500 }, (_, i) => i);
    const yValuesQ = xValuesQ.map((x) => charge * Math.exp(-x * beta) * Math.cos(x * Math.sqrt(1/(inductance*capacitance) - beta**2)));
    const xValuesU = Array.from({ length: 500 }, (_, i) => i);
    const yValuesU = xValuesU.map((x) => charge / capacitance * Math.exp(-x * beta) * Math.cos(x * Math.sqrt(1/(inductance*capacitance) - beta**2)));
    const xValuesI = Array.from({ length: 500 }, (_, i) => i);
    const yValuesI = xValuesU.map((x) => I_max * Math.exp(-x * beta) * Math.sin(x * Math.sqrt(1/(inductance*capacitance) - beta**2)));

    return (
        <div>
            <div>
                <h1 style={{textAlign: "center"}}> Моделирование. Затухающие колебания в LCR контуре.</h1>
                <div>
                <div>
                        Индуктивность L (Гн): <input type="number" min='0' value={inductance} onChange={(e) => updateInductance(parseFloat(e.target.value))}/>
                    </div>
                    <div>
                        Сопротивление R (Ом): <input type="number" min='0' value={resistance} onChange={(e) => updateResistance(parseFloat(e.target.value))}/>
                    </div>
                    <div>
                        Емкость конденсатора С (Ф): <input type="number" min='0' value={capacitance} onChange={(e) => updateCapacitance(parseFloat(e.target.value))}/>
                    </div>
                    <div>
                        Заряд конденсатора q (Кл): <input type="number" value={charge} onChange={(e) => setCharge(parseInt(e.target.value))}/>
                    </div>
                </div>
            </div>
            <Plot
                data={[
                    {
                        x: xValuesQ,
                        y: yValuesQ,
                        type: 'scatter',
                        mode: 'lines',
                        marker: {color: 'red'},
                    },
                ]}
                layout={layout}
            />
            <Plot
                data={[
                    {
                        x: xValuesU,
                        y: yValuesU,
                        type: 'scatter',
                        mode: 'lines',
                        marker: {color: 'green'},
                    },
                ]}
                layout={secondLayout}
            />
            <Plot
                data={[
                    {
                        x: xValuesI,
                        y: yValuesI,
                        type: 'scatter',
                        mode: 'lines',
                        marker: {color: 'blue'},
                    },
                ]}
                layout={thirdLayout}
            />
            {showModal && (
                <div className="modal">
                    <div className="modal-content"
                         style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <h2 style={{textAlign: "center"}}>Внимание!</h2>
                        <p>
                            При данных значениях произойдет апериодичная разрядка, а не затухающие колебания.
                            <br/>
                            Условие затухающих колебаний: R &lt;= 2 * sqrt(L / C)
                        </p>
                        <button onClick={handleCloseModal}>Ввести другие значения</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chart;
