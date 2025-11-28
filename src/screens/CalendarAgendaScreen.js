import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { databaseAgendas } from '../config/firebaseAgendas';
import { ref, onValue } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons';

export default function CalendarAgendaScreen({ hideHeader = false }) {
  const [currentMonth, setCurrentMonth] = useState(9); // Septiembre (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);
  const [selected, setSelected] = useState({ day: null, month: currentMonth, year: currentYear });
  const [tasks, setTasks] = useState([]); // Almacenar tareas desde Firebase

  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const getDaysArray = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDay = firstDayOfMonth(currentMonth, currentYear);

    // Días del mes anterior
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Días del mes actual
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }

    return days;
  };

  // Initialize selected day to today
  useEffect(() => {
    const today = new Date();
    setSelected({ day: today.getDate(), month: today.getMonth(), year: today.getFullYear() });
  }, []);

  // Cargar tareas desde Firebase
  useEffect(() => {
    const tasksRef = ref(databaseAgendas, 'agenda/tasks');
    const unsub = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setTasks(items);
      } else {
        setTasks([]);
      }
    });
    return () => unsub();
  }, []);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Obtener tareas para un día específico
  const getTasksForDate = (day, month, year) => {
    const dateStart = new Date(year, month, day, 0, 0, 0).getTime();
    const dateEnd = new Date(year, month, day, 23, 59, 59).getTime();
    
    return tasks.filter((task) => {
      const dueDate = task.dueDate || task.createdAt;
      return dueDate >= dateStart && dueDate <= dateEnd;
    });
  };

  // Verificar si un día tiene tareas
  const dayHasTasks = (day, month, year) => {
    return getTasksForDate(day, month, year).length > 0;
  };

  // Obtener colores de tareas para un día
  const getTaskColorsForDate = (day, month, year) => {
    const dayTasks = getTasksForDate(day, month, year);
    return dayTasks.map((t) => t.color).slice(0, 3); // Máximo 3 colores para mostrar
  };

  const days = getDaysArray();
  const daysOfWeek = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

  return (
    <ScrollView style={styles.container}>
      {/* Mes Actual */}
      <View style={styles.monthSection}>
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={handlePrevMonth}>
            <Text style={styles.arrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>{months[currentMonth]}</Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Encabezado de días */}
        <View style={styles.daysHeader}>
          {daysOfWeek.map((day) => (
            <View key={day} style={styles.dayHeaderCell}>
              <Text style={styles.dayHeaderText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendario */}
        <View style={styles.calendarGrid}>
          {days.map((day, index) => {
            const isSelected = day && selected.day === day && selected.month === currentMonth && selected.year === currentYear;
            const taskColors = day ? getTaskColorsForDate(day, currentMonth, currentYear) : [];
            return (
              <View key={index} style={styles.dayCell}>
                {day ? (
                  <TouchableOpacity onPress={() => setSelected({ day, month: currentMonth, year: currentYear })} style={isSelected ? styles.selectedWrapper : null}>
                    <Text style={[styles.dayText, isSelected && styles.selectedText]}>{day}</Text>
                    {/* Mostrar puntos de colores si hay tareas */}
                    {taskColors.length > 0 && (
                      <View style={styles.taskDots}>
                        {taskColors.map((color, idx) => (
                          <View key={idx} style={[styles.taskDot, { backgroundColor: color }]} />
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.dayText}>{''}</Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Próximo mes */}
      <View style={[styles.monthSection, styles.nextMonth]}>
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={handleNextMonth}>
            <Text style={styles.arrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {currentMonth === 11 
              ? months[0] 
              : months[currentMonth + 1]}
          </Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Encabezado de días */}
        <View style={styles.daysHeader}>
          {daysOfWeek.map((day) => (
            <View key={day} style={styles.dayHeaderCell}>
              <Text style={styles.dayHeaderText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendario del próximo mes */}
        <View style={styles.calendarGrid}>
          {(() => {
            const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
            const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
            const nextMonthDays = [];
            const nextMonthFirstDay = firstDayOfMonth(nextMonth, nextYear);
            const nextMonthTotalDays = daysInMonth(nextMonth, nextYear);

            // Días vacíos
            for (let i = 0; i < nextMonthFirstDay; i++) {
              nextMonthDays.push(null);
            }

            // Días del mes
            for (let i = 1; i <= nextMonthTotalDays; i++) {
              nextMonthDays.push(i);
            }

            return nextMonthDays.map((day, index) => {
              const isSelected = day && selected.day === day && selected.month === nextMonth && selected.year === nextYear;
              return (
                <View key={index} style={styles.dayCell}>
                  {day ? (
                    <TouchableOpacity onPress={() => setSelected({ day, month: nextMonth, year: nextYear })} style={isSelected ? styles.selectedWrapper : null}>
                      <Text style={[styles.dayText, isSelected && styles.selectedText]}>{day}</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.dayText}>{''}</Text>
                  )}
                </View>
              );
            });
          })()}
        </View>
      </View>

      {/* Tareas del día seleccionado */}
      {selected.day && (
        <View style={styles.dayTasksSection}>
          <Text style={styles.dayTasksTitle}>
            Tareas para {selected.day} de {months[selected.month]}
          </Text>
          {getTasksForDate(selected.day, selected.month, selected.year).length > 0 ? (
            <View style={styles.tasksList}>
              {getTasksForDate(selected.day, selected.month, selected.year).map((task) => (
                <View key={task.id} style={styles.taskItem}>
                  <View style={[styles.taskColorBar, { backgroundColor: task.color }]} />
                  <View style={styles.taskContent}>
                    <Text style={[styles.taskTitle, task.completed && styles.taskCompleted]}>
                      {task.title}
                    </Text>
                    <Text style={styles.taskPriority}>{task.priority}</Text>
                  </View>
                  {task.completed && (
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  )}
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noTasksText}>No hay tareas para este día</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  monthSection: {
    marginBottom: 25,
  },
  nextMonth: {
    marginBottom: 30,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  arrow: {
    fontSize: 24,
    color: '#666',
    paddingHorizontal: 10,
  },
  daysHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 100% / 7 días
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  dayText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  todayText: {
    backgroundColor: '#f08080',
    color: '#fff',
    width: 32,
    height: 32,
    borderRadius: 16,
    paddingTop: 6,
    fontWeight: '600',
  },
  selectedWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f08080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  taskDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 3,
    marginTop: 2,
  },
  taskDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dayTasksSection: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginBottom: 30,
  },
  dayTasksTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  tasksList: {
    gap: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  taskColorBar: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 3,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskPriority: {
    fontSize: 12,
    color: '#666',
  },
  noTasksText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
