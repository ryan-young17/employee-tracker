USE employee_db;
INSERT INTO department (name)
    VALUES
    ('Sales'), -- 1 --
    ('Engineering'), -- 2 --
    ('Finance'), -- 3 --
    ('Legal'); -- 4 --

INSERT INTO role (title, salary, department_id)
    VALUES
    ('Sales Lead', 70000, 1), -- 1 --
    ('Salesperson', 60000, 1), -- 2 --
    ('Lead Engineer', 100000, 2), -- 3 --
    ('Software Engineer', 90000, 2), -- 4 --
    ('Account Manager', 70000, 3), -- 5 --
    ('Accountant', 60000, 3), -- 6 --
    ('Legal Team Lead', 100000, 4), -- 7 --
    ('Lawyer', 90000, 4); -- 8 --

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES
    ('John', 'Doe', 1, null),
    ('Mike', 'Chan', 2, 1),
    ('Ashley', 'Rodriguez', 3, null),
    ('Kevin', 'Tupik', 4, 3),
    ('Kunal', 'Singh', 5, null),
    ('Malia', 'Brown', 6, 5),
    ('Sarah', 'Lourd', 7, null),
    ('Tom', 'Allem', 8, 7);