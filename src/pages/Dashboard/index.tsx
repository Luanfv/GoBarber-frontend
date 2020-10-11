import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { FiClock, FiPower } from 'react-icons/fi';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import api from '../../services/api';

import { useAuth } from '../../hooks/auth';

import { 
    Container, 
    Header, 
    HeaderContent, 
    Profile, 
    Content, 
    Schedule, 
    Calendar, 
    NextAppointment, 
    Section,
    Appointment
} from './style';

import logoImg from '../../assets/logo.svg';

interface MonthAvailabilityItem {
    day: number;
    available: boolean;
}

const Dashboard: React.FC = () => {
    const { signOut, user } = useAuth();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);

    const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
        if (modifiers.available) {
            setSelectedDate(day);
        }

    }, []);

    const handleMonthChange = useCallback((month: Date) => {
        setCurrentMonth(month);
    }, []);

    const disableDays = useMemo(() => {
        const dates = monthAvailability
        .filter(monthDay => monthDay.available === false)
        .map(monthDay => {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth();
            const date = new Date(year, month, monthDay.day);

            return date;
        });

        return dates;
    }, [currentMonth, monthAvailability]);

    useEffect(() => {
        api.get(`/providers/${user.id}/month-availability`, {
            params: {
                year: currentMonth.getFullYear(),
                month: currentMonth.getMonth() + 1,
            },
        })
        .then(response => {
            setMonthAvailability(response.data);
        });
    }, [currentMonth, user.id])

    return (
        <Container>
            <Header>
                <HeaderContent>
                    <img src={logoImg} alt="GoBarber" />

                    <Profile>
                        <img 
                            src={user.avatar_url} 
                            alt={user.name} 
                        />
                        <div>
                            <span>Bem-vindo,</span>
                            <strong>{user.name}</strong>
                        </div>
                    </Profile>

                    <button type="button" onClick={signOut}>
                        <FiPower />
                    </button>
                </HeaderContent>
            </Header>

            <Content>
                <Schedule>
                    <h1>Horários agendados</h1>
                    <p>
                        <span>Hoje</span>
                        <span>Dia 06</span>
                        <span>Segunda-feira</span>
                    </p>

                    <NextAppointment>
                        <strong>Atendimento a seguir</strong>
                        <div>
                            <img
                                src={user.avatar_url}
                                alt={user.name}
                            />

                            <strong>
                                {user.name}
                            </strong>
                            <span>
                                <FiClock />
                                08:00
                            </span>
                        </div>
                    </NextAppointment>

                    <Section>
                        <strong>Manhã</strong>

                        <Appointment>
                            <span>
                                <FiClock />
                                08:00
                            </span>

                            <div>
                                <img 
                                    src={user.avatar_url}
                                    alt={user.name}
                                />

                                <strong>
                                    {user.name}
                                </strong>
                            </div>
                        </Appointment>

                        <Appointment>
                            <span>
                                <FiClock />
                                09:00
                            </span>

                            <div>
                                <img 
                                    src={user.avatar_url}
                                    alt={user.name}
                                />

                                <strong>
                                    {user.name}
                                </strong>
                            </div>
                        </Appointment>
                    </Section>

                    <Section>
                        <strong>Tarde</strong>

                        <Appointment>
                            <span>
                                <FiClock />
                                14:00
                            </span>

                            <div>
                                <img 
                                    src={user.avatar_url}
                                    alt={user.name}
                                />

                                <strong>
                                    {user.name}
                                </strong>
                            </div>
                        </Appointment>

                        <Appointment>
                            <span>
                                <FiClock />
                                15:00
                            </span>

                            <div>
                                <img 
                                    src={user.avatar_url}
                                    alt={user.name}
                                />

                                <strong>
                                    {user.name}
                                </strong>
                            </div>
                        </Appointment>
                    </Section>
                </Schedule>
                <Calendar>
                    <DayPicker 
                        weekdaysShort={[
                            'D', 'S', 'T', 'Q', 'Q', 'S', 'S',
                        ]}
                        fromMonth={new Date()}
                        onMonthChange={handleMonthChange}
                        disabledDays={[
                            { daysOfWeek: [0, 6] }, ...disableDays
                        ]}
                        modifiers={{
                            available: { daysOfWeek: [1, 2, 3, 4, 5] }
                        }}
                        selectedDays={selectedDate}
                        onDayClick={handleDateChange}
                        months={[
                            'Janeiro',
                            'Fevereiro',
                            'Março',
                            'Abril',
                            'Maio',
                            'Junho',
                            'Julho',
                            'Agosto',
                            'Setembro',
                            'Outubro',
                            'Novembro',
                            'Dezembro',
                        ]}
                    />
                </Calendar>
            </Content>
        </Container>
    );
}

export default Dashboard;