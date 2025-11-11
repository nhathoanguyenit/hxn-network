import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    CreateDateColumn,
    UpdateDateColumn,
    JoinTable,
} from "typeorm";

@Entity({name: "users", schema:"hxn_user"})
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    username: string;

    @Column()
    fullname: string;

    @Column({ select: false })
    password: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @ManyToMany(() => Role, (role) => role.users, {
        cascade: true,
        createForeignKeyConstraints: false,
    })
    @JoinTable({
        name: "user_roles",
        joinColumn: { name: "user_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "role_id", referencedColumnName: "id" },
    })
    roles: Role[];
}

@Entity({name: "user_profiles", schema:"hxn_user"})
export class UserProfile {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "uuid", name: "user_id" })
    userId: string;

    @Column({ name: "display_name", nullable: true })
    displayName?: string;

    @Column({ name: "avatar_url", nullable: true })
    avatarUrl?: string;

    @Column({ nullable: true })
    bio?: string;

    @Column({ nullable: true })
    birthday?: Date;

    @Column({ nullable: true })
    location?: string;

    @Column({ nullable: true })
    work?: string;

    @Column({ type: "text", array: true, nullable: true })
    interests?: string[];

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}


@Entity({name: "roles", schema:"hxn_user"})
export class Role {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    code: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @ManyToMany(() => User, (user) => user.roles, {
        createForeignKeyConstraints: false,
    })
    users: User[];
      
    @ManyToMany(() => Permission, (permission) => permission.roles, {
        cascade: true,
        createForeignKeyConstraints: false,
    })
    @JoinTable({
        name: "role_permissions",
        joinColumn: { name: "role_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" },
    })
    permissions: Permission[];
}

@Entity({name: "permissions", schema:"hxn_user"})
export class Permission {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    code: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description?: string;

    @ManyToMany(() => Role, (role) => role.permissions, {
        createForeignKeyConstraints: false,
    })
    roles: Role[];

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
