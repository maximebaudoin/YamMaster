import React, { useEffect, useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";

const Grid = () => {

    const socket = useContext(SocketContext);

    const [displayGrid, setDisplayGrid] = useState(true);
    const [canSelectCells, setCanSelectCells] = useState([]);
    const [grid, setGrid] = useState(
        Array(5).fill().map(() => (
            Array(5).fill().map(() => (
                { viewContent: '', id: '', owner: null, canBeChecked: false }
            ))
        ))
    );

    const handleSelectCell = (cellId, rowIndex, cellIndex) => {
        if (canSelectCells) {
            socket.emit("game.grid.selected", { cellId, rowIndex, cellIndex });
        }
    };

    useEffect(() => {
        socket.on("game.grid.view-state", (data) => {
            setDisplayGrid(data['displayGrid']);
            setCanSelectCells(data['canSelectCells'])
            setGrid(data['grid']);
        });
    }, []);

    return (
        <View style={styles.gridContainer}>
            {displayGrid &&
                grid.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((cell, cellIndex) => (
                            <>
                                <TouchableOpacity
                                    key={rowIndex+cellIndex+cell.id}
                                    style={[
                                        styles.cell,
                                        cell.owner === "player:1" && styles.playerOwnedCell,
                                        cell.owner === "player:2" && styles.opponentOwnedCell,
                                        (cell.canBeChecked && !(cell.owner === "player:1") && !(cell.owner === "player:2")) && styles.canBeCheckedCell,
                                    ]}
                                    onPress={() => handleSelectCell(cell.id, rowIndex, cellIndex)}
                                    disabled={!cell.canBeChecked}
                                >
                                    <Text style={styles.cellText}>{cell.viewContent}</Text>
                                </TouchableOpacity>
                            </>
                        ))}
                    </View>
                ))}
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        flex: 5,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 4,
        paddingHorizontal: 5
    },
    row: {
        flexDirection: "row",
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: 4
    },
    cell: {
        flexDirection: "row",
        flex: 2,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 5
    },
    cellText: {
        fontSize: 17,
        fontWeight: "600",
        color: "#fff"
    },
    playerOwnedCell: {
        backgroundColor: "rgba(0,255,0,0.5)",
    },
    opponentOwnedCell: {
        backgroundColor: "rgba(200,0,0,0.7)",
    },
    canBeCheckedCell: {
        backgroundColor: "rgba(255,100,255,0.9)",
    }
});

export default Grid;