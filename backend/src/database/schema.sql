create table gatos (
    id integer generated always as identity primary key,
    nome varchar(100) not null,
    idade varchar(20) not null,
    sexo varchar(10) not null,
    descricao text,
    personalidade text,
    foto text not null,
    castrado boolean not null default false,
    vacinado boolean not null default false,
    disponivel boolean not null default true,
    criado_em timestamp not null default current_timestamp
);