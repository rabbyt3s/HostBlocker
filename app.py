import os
import shutil
import tempfile
import math
import threading
import webview
from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
from urllib.parse import urlparse, parse_qs

hosts_file_path = 'hosts.txt'
windows_hosts_file_path = os.path.join(os.environ['WINDIR'], 'System32', 'drivers', 'etc', 'hosts')

def read_hosts_file():
    with open(hosts_file_path, 'r') as file:
        hosts = [line.strip() for line in file.readlines()]
    return hosts

def write_hosts_file(lines):
    temp_file_path = os.path.join(tempfile.gettempdir(), 'hosts')
    with open(temp_file_path, 'w') as temp_file:
        temp_file.write('\n'.join(lines))
    shutil.copy(temp_file_path, windows_hosts_file_path)

def block_hosts(hosts_to_block):
    with open(windows_hosts_file_path, 'r') as file:
        lines = file.readlines()

    new_lines = []
    for line in lines:
        if line.strip() and not line.startswith('#'):
            parts = line.strip().split()
            if len(parts) >= 2:
                host = parts[-1]
                if host not in hosts_to_block:
                    new_lines.append(line.strip())
            else:
                new_lines.append(line.strip())
        else:
            new_lines.append(line.strip())

    for host in hosts_to_block:
        new_lines.append(f'0.0.0.0 {host}')

    write_hosts_file(new_lines)

def unblock_hosts(hosts_to_unblock):
    with open(windows_hosts_file_path, 'r') as file:
        lines = file.readlines()

    new_lines = []
    for line in lines:
        if line.strip() and not line.startswith('#'):
            parts = line.strip().split()
            if len(parts) >= 2:
                host = parts[-1]
                if host not in hosts_to_unblock:
                    new_lines.append(line.strip())
            else:
                new_lines.append(line.strip())
        else:
            new_lines.append(line.strip())

    write_hosts_file(new_lines)

class CustomHTTPRequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # Serve static files and the index.html
        if self.path in ('/', '/index.html'):
            self.path = '/templates/index.html'
        elif self.path.startswith('/static/'):
            self.path = self.path.replace('/static/', '/static/')
        else:
            self.handle_api_request()
            return
        return SimpleHTTPRequestHandler.do_GET(self)

    def handle_api_request(self):
        # Handle your API requests here
        if self.path.startswith('/hosts'):
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            # Fetch the hosts data
            hosts_data = read_hosts_file()
            # Parse query parameters for pagination and search
            query_components = parse_qs(urlparse(self.path).query)
            page = int(query_components.get('page', [1])[0])
            search = query_components.get('search', [''])[0]
            hosts_per_page = 10
            filtered_hosts = [host for host in hosts_data if search.lower() in host.lower()]
            total_pages = math.ceil(len(filtered_hosts) / hosts_per_page)
            start_index = (page - 1) * hosts_per_page
            end_index = start_index + hosts_per_page
            paginated_hosts = filtered_hosts[start_index:end_index]
            response = {
                'hosts': paginated_hosts,
                'totalPages': total_pages,
                'totalHosts': len(filtered_hosts),
                'allHosts': filtered_hosts
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_error(404, "File not found.")

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        if self.path == '/block':
            data = json.loads(post_data.decode('utf-8'))
            block_hosts(data['hosts'])
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True}).encode('utf-8'))
        elif self.path == '/unblock':
            data = json.loads(post_data.decode('utf-8'))
            unblock_hosts(data['hosts'])
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True}).encode('utf-8'))
        else:
            self.send_error(404, "File not found.")

def run_server():
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, CustomHTTPRequestHandler)
    httpd.serve_forever()

if __name__ == '__main__':
    server_thread = threading.Thread(target=run_server)
    server_thread.daemon = True
    server_thread.start()

    webview.create_window('HostBlocker', 'http://127.0.0.1:8000/')
    webview.start()

