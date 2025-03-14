PGDMP      
                }            hotel_management    17.3    17.3 6    4           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            5           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            6           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            7           1262    16388    hotel_management    DATABASE     v   CREATE DATABASE hotel_management WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-US';
     DROP DATABASE hotel_management;
                     postgres    false            �            1259    16490 
   attendance    TABLE     p  CREATE TABLE public.attendance (
    id integer NOT NULL,
    user_id integer,
    attendance_date date NOT NULL,
    status character varying(10),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT attendance_status_check CHECK (((status)::text = ANY ((ARRAY['Present'::character varying, 'Absent'::character varying])::text[])))
);
    DROP TABLE public.attendance;
       public         heap r       postgres    false            �            1259    16489    attendance_id_seq    SEQUENCE     �   CREATE SEQUENCE public.attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.attendance_id_seq;
       public               postgres    false    228            8           0    0    attendance_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.attendance_id_seq OWNED BY public.attendance.id;
          public               postgres    false    227            �            1259    16448 
   complaints    TABLE     �   CREATE TABLE public.complaints (
    id integer NOT NULL,
    user_id integer NOT NULL,
    complaint text NOT NULL,
    date date NOT NULL,
    status character varying(50) DEFAULT 'Pending'::character varying
);
    DROP TABLE public.complaints;
       public         heap r       postgres    false            �            1259    16447    complaints_id_seq    SEQUENCE     �   CREATE SEQUENCE public.complaints_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.complaints_id_seq;
       public               postgres    false    226            9           0    0    complaints_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.complaints_id_seq OWNED BY public.complaints.id;
          public               postgres    false    225            �            1259    16402    hostel_registrations    TABLE     �  CREATE TABLE public.hostel_registrations (
    id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    father_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone_number character varying(20) NOT NULL,
    department character varying(255) NOT NULL,
    hostel_type character varying(50) NOT NULL,
    address text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id integer,
    mess_type character varying(50),
    CONSTRAINT hostel_registrations_hostel_type_check CHECK (((hostel_type)::text = ANY ((ARRAY['ac'::character varying, 'nonAc'::character varying, 'mixed'::character varying])::text[])))
);
 (   DROP TABLE public.hostel_registrations;
       public         heap r       postgres    false            �            1259    16401    hostel_registrations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.hostel_registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.hostel_registrations_id_seq;
       public               postgres    false    220            :           0    0    hostel_registrations_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.hostel_registrations_id_seq OWNED BY public.hostel_registrations.id;
          public               postgres    false    219            �            1259    16420    recent_activities    TABLE     �   CREATE TABLE public.recent_activities (
    id integer NOT NULL,
    user_id integer NOT NULL,
    activity text NOT NULL,
    date date NOT NULL,
    status character varying(50) DEFAULT 'Pending'::character varying
);
 %   DROP TABLE public.recent_activities;
       public         heap r       postgres    false            �            1259    16419    recent_activities_id_seq    SEQUENCE     �   CREATE SEQUENCE public.recent_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.recent_activities_id_seq;
       public               postgres    false    222            ;           0    0    recent_activities_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.recent_activities_id_seq OWNED BY public.recent_activities.id;
          public               postgres    false    221            �            1259    16434    requests    TABLE     �   CREATE TABLE public.requests (
    id integer NOT NULL,
    user_id integer NOT NULL,
    request text NOT NULL,
    date date NOT NULL,
    status character varying(50) DEFAULT 'Pending'::character varying
);
    DROP TABLE public.requests;
       public         heap r       postgres    false            �            1259    16433    requests_id_seq    SEQUENCE     �   CREATE SEQUENCE public.requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.requests_id_seq;
       public               postgres    false    224            <           0    0    requests_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.requests_id_seq OWNED BY public.requests.id;
          public               postgres    false    223            �            1259    16390    users    TABLE     .  CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL,
    role character varying(10) NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'user'::character varying])::text[])))
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    16389    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    218            =           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    217            y           2604    16505    attendance id    DEFAULT     n   ALTER TABLE ONLY public.attendance ALTER COLUMN id SET DEFAULT nextval('public.attendance_id_seq'::regclass);
 <   ALTER TABLE public.attendance ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    227    228    228            w           2604    16506    complaints id    DEFAULT     n   ALTER TABLE ONLY public.complaints ALTER COLUMN id SET DEFAULT nextval('public.complaints_id_seq'::regclass);
 <   ALTER TABLE public.complaints ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    225    226    226            q           2604    16507    hostel_registrations id    DEFAULT     �   ALTER TABLE ONLY public.hostel_registrations ALTER COLUMN id SET DEFAULT nextval('public.hostel_registrations_id_seq'::regclass);
 F   ALTER TABLE public.hostel_registrations ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219    220            s           2604    16508    recent_activities id    DEFAULT     |   ALTER TABLE ONLY public.recent_activities ALTER COLUMN id SET DEFAULT nextval('public.recent_activities_id_seq'::regclass);
 C   ALTER TABLE public.recent_activities ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    221    222            u           2604    16509    requests id    DEFAULT     j   ALTER TABLE ONLY public.requests ALTER COLUMN id SET DEFAULT nextval('public.requests_id_seq'::regclass);
 :   ALTER TABLE public.requests ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    223    224    224            p           2604    16510    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    217    218    218            1          0    16490 
   attendance 
   TABLE DATA           V   COPY public.attendance (id, user_id, attendance_date, status, created_at) FROM stdin;
    public               postgres    false    228   D       /          0    16448 
   complaints 
   TABLE DATA           J   COPY public.complaints (id, user_id, complaint, date, status) FROM stdin;
    public               postgres    false    226   �E       )          0    16402    hostel_registrations 
   TABLE DATA           �   COPY public.hostel_registrations (id, full_name, father_name, email, phone_number, department, hostel_type, address, created_at, user_id, mess_type) FROM stdin;
    public               postgres    false    220   EF       +          0    16420    recent_activities 
   TABLE DATA           P   COPY public.recent_activities (id, user_id, activity, date, status) FROM stdin;
    public               postgres    false    222   ~G       -          0    16434    requests 
   TABLE DATA           F   COPY public.requests (id, user_id, request, date, status) FROM stdin;
    public               postgres    false    224   �G       '          0    16390    users 
   TABLE DATA           :   COPY public.users (id, email, password, role) FROM stdin;
    public               postgres    false    218   =H       >           0    0    attendance_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.attendance_id_seq', 68, true);
          public               postgres    false    227            ?           0    0    complaints_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.complaints_id_seq', 7, true);
          public               postgres    false    225            @           0    0    hostel_registrations_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.hostel_registrations_id_seq', 23, true);
          public               postgres    false    219            A           0    0    recent_activities_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.recent_activities_id_seq', 13, true);
          public               postgres    false    221            B           0    0    requests_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.requests_id_seq', 9, true);
          public               postgres    false    223            C           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 26, true);
          public               postgres    false    217            �           2606    16497    attendance attendance_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.attendance DROP CONSTRAINT attendance_pkey;
       public                 postgres    false    228            �           2606    16499 1   attendance attendance_user_id_attendance_date_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_user_id_attendance_date_key UNIQUE (user_id, attendance_date);
 [   ALTER TABLE ONLY public.attendance DROP CONSTRAINT attendance_user_id_attendance_date_key;
       public                 postgres    false    228    228            �           2606    16455    complaints complaints_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.complaints DROP CONSTRAINT complaints_pkey;
       public                 postgres    false    226            �           2606    16413 3   hostel_registrations hostel_registrations_email_key 
   CONSTRAINT     o   ALTER TABLE ONLY public.hostel_registrations
    ADD CONSTRAINT hostel_registrations_email_key UNIQUE (email);
 ]   ALTER TABLE ONLY public.hostel_registrations DROP CONSTRAINT hostel_registrations_email_key;
       public                 postgres    false    220            �           2606    16411 .   hostel_registrations hostel_registrations_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.hostel_registrations
    ADD CONSTRAINT hostel_registrations_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.hostel_registrations DROP CONSTRAINT hostel_registrations_pkey;
       public                 postgres    false    220            �           2606    16427 (   recent_activities recent_activities_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.recent_activities
    ADD CONSTRAINT recent_activities_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.recent_activities DROP CONSTRAINT recent_activities_pkey;
       public                 postgres    false    222            �           2606    16441    requests requests_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.requests DROP CONSTRAINT requests_pkey;
       public                 postgres    false    224                       2606    16400    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public                 postgres    false    218            �           2606    16398    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    218            �           2606    16500 "   attendance attendance_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 L   ALTER TABLE ONLY public.attendance DROP CONSTRAINT attendance_user_id_fkey;
       public               postgres    false    4737    228    218            �           2606    16456 "   complaints complaints_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 L   ALTER TABLE ONLY public.complaints DROP CONSTRAINT complaints_user_id_fkey;
       public               postgres    false    226    218    4737            �           2606    16414 6   hostel_registrations hostel_registrations_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.hostel_registrations
    ADD CONSTRAINT hostel_registrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 `   ALTER TABLE ONLY public.hostel_registrations DROP CONSTRAINT hostel_registrations_user_id_fkey;
       public               postgres    false    4737    220    218            �           2606    16428 0   recent_activities recent_activities_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.recent_activities
    ADD CONSTRAINT recent_activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 Z   ALTER TABLE ONLY public.recent_activities DROP CONSTRAINT recent_activities_user_id_fkey;
       public               postgres    false    218    4737    222            �           2606    16442    requests requests_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 H   ALTER TABLE ONLY public.requests DROP CONSTRAINT requests_user_id_fkey;
       public               postgres    false    218    4737    224            1   �  x���Kn1D��S�F�_�v���U o�Hr��NMܝ�V�CU�%�&#��β�|�����tt������l}&�|���%�f�);ئ��w�͗%"5	r#]@|�PUV �H��:C+_D/ }ho�a�J�_q��iπ=���Z15����v ��BqF��I��#�O�*�s���T��d"10[�d9i�i�"TG=2�	0NI�l,��&L���f��;0���eC�y�W+k�$�eޑN�TQ�ɹ�X=��u�V.�t���׌�c1D� ѹɗ�~#Q: �|��b�
��ϐLJ�����Y���4�WJ̅�K��P��9=2��8n�Cr5�ڬ��ܑ�A���0�[
q��AWD}�
ߛf��;�Q�w�k�)X�+�!����A�"�\��a���a��	�3�r&��4�}��\��L��*��o�-^ �y/pv      /   U   x�3�4�,N�4202�50�54�J-��)KM�2K���,�rY��%@9sN#c��b��B�	P_UU�L΀Լ�̼t�=... =��      )   )  x�u��r� ���y�0��Ծ@�=�U[5�����l����aX�7�O9|��m�>V�}<���v���T���8>W�{�^�('��'�C627�*%Q���Z7Y�������V�,wKCZ�EY�PK���z�in����}����fГ�{��i7�n�����pa��B�Z����#�'n�jX:ߎ�7�V
�����I$4��B����8vI��j����r���L�Y�R3@���H��w�F��(4JR뀱K���c�r��k�A)Hc�_NܛȲ��M��      +   P   x�E�1
�0���.�4��C�D���Ƿ[��2C�{���ĒX�z����8��%�>�'r�T�������z�h���l��      -   O   x�3�4�LN�4202�50�5��H�K��K�2�#d��2�8e,�2))(RA�Y��%�)\��FƜ��9��=... �� '      '   �  x�EԷ��j ���S�O�� �$�nC� Q��g���[;c�������5�Oe��7�mt��T)aui3ER�e��VcQ�������ϻyL�t�����U1!{Q���U+�^4U_¬I�08��.G��d�M�"(������w��ܵ�Sṟ
}��w?��}FL�@s��׀�kZ������	����:1�¢���|�ԕ�{��c�挌c,�x�F�WRē�:�t^\��/�� �W�by��ʆ�vK�=�#�����(>:>�r�]�}sN��U0,�&h�*�A���q�Fv�פ�Ѷy�lW܈/��m������	L�n�p<���d��w!�5�����}ϖ"����̷���oH�xn���B�S���.d%5@�F]ty�S��$���r���|��$�4�*KD!զB%�
���@F�p�0�����<Ho�P���:��VN��g�P7�],�9���8a�D�屼�����o	�+}�2�)���j�r����vQr;n\JW7Ȩp�;mbǮ��o��|S�{�}����:FnLp�∅��34�v���h���R̠���'�SH�$����Q�F���|�Y 
d_������7Cu�Γ�$�m8��}��_�׺I|B�}D�>��Æ<�M4v�(�͊D��
��Ԏ�5j�D~���\�F��M�_R����M�(?���B	�Ron9�� ���my� ��ꏳz�t~0w�����=�]�xeׇg��q�!���ѐr�㶞��>��s=�n!��Jp��w q��Ŗ�D�J�p�WL�D��b�
Y����H��J.kQ�a��n�$6��`%��Du;���A�HE7����n�.�`(�!��.����bY,Ig{��*���y��rE����������v��^     