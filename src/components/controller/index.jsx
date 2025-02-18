import styles from './Controller.module.css'

function Controller({controllerId, incrementFunction, decrementFunction, controllerValue}) {
    const label = controllerId[0].toUpperCase() + controllerId.substring(1);
    return (
        <div id={controllerId} className={styles['controller']}>
            <h2 id={`${controllerId}-label`}>{`${label} Length`}</h2>

            <div>
                <button id={`${controllerId}-decrement`} onClick={decrementFunction}>--</button>
                <span id={`${controllerId}-length`}>{controllerValue}</span>
                <button id={`${controllerId}-increment`} onClick={incrementFunction}>++</button>
            </div>
        </div>
    );
}

export default Controller;
