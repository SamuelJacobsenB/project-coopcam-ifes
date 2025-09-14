import { useState } from "react";

import { Card, DualPage, I, Navbar, Search } from "../../components";
import type { User } from "../../types";

import styles from "./styles.module.css";

export function UsersPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([
    {
      id: "user-001",
      template_id: "template-001",
      weekly_preference_id: "pref-001",
      name: "Ana Beatriz Silva",
      email: "ana.silva@example.com",
      roles: ["user"],
      cpf: "123.456.789-00",
      phone: "+55 11 91234-5678",
      adress: "Rua das Flores, 123",
      cep: "01001-000",
      template: null,
      weekly_preference: null,
      created_at: new Date("2025-09-01T10:00:00Z"),
      updated_at: new Date("2025-09-10T15:30:00Z"),
    },
    {
      id: "user-002",
      template_id: "template-002",
      weekly_preference_id: "pref-002",
      name: "Carlos Eduardo Ramos",
      email: "carlos.ramos@example.com",
      roles: ["user"],
      cpf: "987.654.321-00",
      phone: "+55 21 99876-5432",
      adress: "Av. Atlântica, 456",
      cep: "22041-001",
      template: null,
      weekly_preference: null,
      created_at: new Date("2025-08-25T08:45:00Z"),
      updated_at: new Date("2025-09-12T12:00:00Z"),
    },
    {
      id: "user-003",
      template_id: "template-003",
      weekly_preference_id: "pref-003",
      name: "Juliana Costa",
      email: "juliana.costa@example.com",
      roles: ["user"],
      cpf: "321.654.987-00",
      phone: "+55 31 91111-2222",
      adress: "Rua do Sol, 789",
      cep: "30140-110",
      template: null,
      weekly_preference: null,
      created_at: new Date("2025-09-05T14:20:00Z"),
      updated_at: new Date("2025-09-13T09:10:00Z"),
    },
    {
      id: "user-004",
      template_id: "template-004",
      weekly_preference_id: "pref-004",
      name: "Fernando Oliveira",
      email: "fernando.oliveira@example.com",
      roles: ["user"],
      cpf: "456.789.123-00",
      phone: "+55 41 93456-7890",
      adress: "Travessa das Palmeiras, 321",
      cep: "80010-000",
      template: null,
      weekly_preference: null,
      created_at: new Date("2025-09-03T11:15:00Z"),
      updated_at: new Date("2025-09-13T18:45:00Z"),
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <>
      <Navbar />
      <DualPage
        leftSide={
          <>
            <section className={styles.header}>
              <h1>Usuários</h1>
              <p>Pesquise por usuários</p>
            </section>
            <Search
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Buscar usuários..."
            />
            <ul className={styles.userList}>
              {users
                .filter((user) =>
                  user.name.toLowerCase().startsWith(search.toLowerCase())
                )
                .map((user) => (
                  <li key={user.id}>
                    <Card
                      className={`${styles.userItem} ${
                        selectedUser?.id === user.id && styles.selectedUser
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <I.user />
                      <h5>{user.name}</h5>
                    </Card>
                  </li>
                ))}
            </ul>
          </>
        }
        rightSide={
          <>
            {selectedUser ? (
              <>
                <Card className={styles.selectedUserBox}>
                  <div className={styles.userPicture}>
                    <I.user size={128} />
                  </div>
                  <div className={styles.userInfo}>
                    <h1>{selectedUser.name}</h1>
                    <div className={styles.userDetails}>
                      <section>
                        <p>Email: {selectedUser.email}</p>
                        <p>CPF: {selectedUser.cpf}</p>
                        <p>Telefone: {selectedUser.phone}</p>
                      </section>
                      <section>
                        <p>Endereço: {selectedUser.adress}</p>
                        <p>CEP: {selectedUser.cep}</p>
                      </section>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card className={styles.nonSelectedUserBox}>
                <h1>Selecione um usuário</h1>
                <p>Selecione um usuário para ver mais detalhes sobre este.</p>
              </Card>
            )}
          </>
        }
        leftClassName={styles.left}
      />
    </>
  );
}
