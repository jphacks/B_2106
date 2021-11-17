resource "aws_security_group" "jphacks_public" {
    vpc_id = aws_vpc.jphacks.id
    name = "public-ec2"

    ingress {
        from_port   = 80
        to_port     = 80
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress{
        from_port   = 8080
        to_port     = 8080
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_instance" "web-server" {
    ami           = "ami-0e60b6d05dc38ff11"
    instance_type = "t2.micro"
    key_name      = aws_key_pair.jphacks.id

    subnet_id              = aws_subnet.public_1a.id
    vpc_security_group_ids = [aws_security_group.jphacks_public.id]


    tags = {
        Name = "web"
    }
}

resource "aws_eip" "jphacks" {
    instance = aws_instance.web-server.id
    vpc      = true
}

resource "aws_key_pair" "jphacks" {
    key_name = "jphacks"
    public_key = file(".key/id_rsa_maj.pub")
}
