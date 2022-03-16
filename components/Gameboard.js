import React, { useState, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import styles from '../style/style'

let board = [];
const NBR_OF_DICES = 5;
const NBR_OF_THROWS = 3;
const NUMBER = [
    {value:1, icon: "numeric-1-circle"},
    {value:2, icon: "numeric-2-circle"},
    {value:3, icon: "numeric-3-circle"},
    {value:4, icon: "numeric-4-circle"},
    {value:5, icon: "numeric-5-circle"},
    {value:6, icon: "numeric-6-circle"}
];

export default function Gameboard() {

    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('');

    const [diceSum, setDiceSum] = 
        useState(new Array(6).fill(0));
    const [selectedDices, setSelectedDices] = 
        useState(new Array(NBR_OF_DICES).fill(false));
    const [selectedPoints, setSelectedPoints] = 
        useState(new Array(6).fill(false));
    const [values, setValues] = useState([]);

    const [total, setTotal] = useState(0); 
    const [bonus, setBonus] = useState(63);
    const [bonusText, setBonusText] = useState("You are 63 points away from bonus.");
    const [buttonText, setButtonText] = useState("Throw dices.");

    /* Dices */
    function getDiceColor(i) {
        return selectedDices[i] ? "black" : "steelblue";
    }

    function selectDice(i) {
        if (nbrOfThrowsLeft === NBR_OF_THROWS) {
            setStatus("You have to throw dices first.");
            return
        }

        let dices = [...selectedDices]; 
        dices[i] = selectedDices[i] ? false : true;

        if (dices[i] = selectedDices[i] ? false : true) {
            setSelectedDices(dices);
        }
    }

    const row_dices = [];
    for (let i = 0; i < NBR_OF_DICES; i++) {
        row_dices.push(
            <Pressable
            key={"row" + i} onPress={() => selectDice(i)}>
                <MaterialCommunityIcons
                    name={board[i]}
                    key={"row" + i}
                    size={50}
                    color={getDiceColor(i)}>
                </MaterialCommunityIcons>
            </Pressable>
        )
    }

    /* Points 
    function getBonus(i) {
        let bonus_point = 0;
        if (selectPoint[i] = true) {
            for (let i = 0; i < NBR_OF_DICES; i++) {
                if (selectDice[i] = false) {
                    bonus_point += board[throwDices.randomNumber];
                    return board_bonus[i] = 'numeric'+ bonus_point; 
                }
            }
            return board_bonus[i] = 'numeric-0';
        }
    }
    */

    function getPointColor(i) {
        return selectedPoints[i] ? "black" : "steelblue";
    }

    function selectPoint(i) {
        if (nbrOfThrowsLeft > 0) {
            setStatus("Throw 3 times before setting points.");
            return 
        }

        if (selectedPoints[i] === true) {
            setStatus("You already selected points for " + (i+1));
            return
        }

        let points = [...selectedPoints];
        let count = 0;
        let dices = [...diceSum];
        points[i] = selectPoint[i] ? false : true;
        for (let j = 0; j < values.length; j++) {
            if (NUMBER[i].value == values[j]) {
                count = count + values[j];
            }
        }
        setSelectedPoints(points);
        dices[i] = count;
        setDiceSum(dices);

        let sum = dices.reduce((partialSum, a) => partialSum + a, 0);
        setTotal(sum);

        setBonus(63-sum);

        setSelectedDices(new Array(6).fill(false));
        setNbrOfThrowsLeft(3);
    }

    /* Bonus 
    const row_bonus = [];
    for (let i = 0; i < 6; i++) {
        row_bonus.push(
            <MaterialCommunityIcons style={styles.score}
                name={'numeric-0'} 
                key={"row" + i}
                size={30}
                color={"black"}>
            </MaterialCommunityIcons>
        )
    }*/

    const row_points = [];
    for (let i = 0; i < NUMBER.length; i++) {
        row_points.push(
            <View key={"row_points" + i}>
                <Text style={styles.gameinfo}>{diceSum[i]}</Text>
                <Pressable
                    key={"row_2" + i} onPress={() => selectPoint(i)}>
                    <MaterialCommunityIcons 
                        name={NUMBER[i].icon}
                        key={"row_2" + i}
                        size={40}
                        color={getPointColor(i)}>
                    </MaterialCommunityIcons>
                </Pressable>
            </View>
        )
    }

    useEffect(() => {
        checkStatus();
        checkBonusPoints();
    }, [nbrOfThrowsLeft, total]);

    function checkStatus() {
        if (nbrOfThrowsLeft === 0) {
            return setStatus('Select your points.');
        }
        else if (nbrOfThrowsLeft < 3) {
            return setStatus('Select and throw dices again.');
        }
        else {
        return setStatus("Throw dices.");
        }
    }

    function throwDices() {
        if ( selectedPoints.every(value => value === true) ) {
            setStatus("");
            setNbrOfThrowsLeft(NBR_OF_THROWS);
            setBonusText("You are 63 points away from bonus.");
            setSelectedDices(new Array(NBR_OF_DICES).fill(false));
            setValues([]);
            setSelectedPoints(new Array(6).fill(false));
            setDiceSum(new Array(6).fill(0));
            setTotal(0);
            setBonus(63);
            setButtonText("Throw dices");
            board = [];
            return 
        }

        if (nbrOfThrowsLeft === 0) {
            setStatus("Select your points before next throw");
            return
        }

        let diceValue = [...values];
        for (let i = 0; i < NBR_OF_DICES; i++) {
            if (!selectedDices[i]) {
                let randomNumber = Math.floor(Math.random() * 6 + 1);
                board[i] = 'dice-'+ randomNumber;
                diceValue[i] = randomNumber;
            }
        setNbrOfThrowsLeft(nbrOfThrowsLeft-1);
        setValues(diceValue);
        }
    }

    function checkBonusPoints() {
        setBonusText("You are " + bonus + " points away from bonus");

        if ( total >= 63 ) {
            setBonusText("You got the bonus!");
        }
        if ( selectedPoints.every(value => value === true) ) {
            setStatus("Game over. All points selected.");
            setNbrOfThrowsLeft(0);
            setButtonText("Reset game.");
            return 
        }
    }
  
    return(
        <View style={styles.gameboard}>
            <View style={styles.dices}>{row_dices}</View>

            <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
            <Text style={styles.gameinfo}>{status}</Text>

            <Pressable style={styles.button}
                onPress={() => throwDices()}>
                    <Text style={styles.buttonText}>
                        {buttonText}
                    </Text>
            </Pressable>

            <Text style={styles.gameinfo}>Total: {total}</Text>    

            <Text style={styles.gameinfo}>{bonusText}</Text>
            <View style={styles.flex}><Text>{row_points}</Text></View>
        </View>
    )
}