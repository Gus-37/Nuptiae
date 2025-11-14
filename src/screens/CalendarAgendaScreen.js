import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function CalendarAgendaScreen() {
  const [currentMonth, setCurrentMonth] = useState(9); // Septiembre (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);
  const [selected, setSelected] = useState({ day: null, month: currentMonth, year: currentYear });

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
            return (
              <View key={index} style={styles.dayCell}>
                {day ? (
                  <TouchableOpacity onPress={() => setSelected({ day, month: currentMonth, year: currentYear })} style={isSelected ? styles.selectedWrapper : null}>
                    <Text style={[styles.dayText, isSelected && styles.selectedText]}>{day}</Text>
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
});
