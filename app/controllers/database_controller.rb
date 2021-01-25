class DatabaseController < ApplicationController
    $db_data_dir = File.join(Rails.root, "data", "static_viz_data")

    def overview
        table_json = {
            'pie1': 'BMI.stat.csv',  
            'pie2': 'host_age.stat.csv',
            'pie3': 'sex.stat.csv',  
            'pie4': 'country.stat.csv',
        };
        @table_data = {};
        table_json.each do |key, path|
            p = File.join($db_data_dir, path)
            if(File.file?(p))
                current_json = {}
                File.readlines(p).each_with_index do |line, i|
                    contents = line.chomp.split(",")
                    if i == 0
                        current_json['head'] = contents
                    elsif current_json['body']
                        current_json['body'].push(contents)
                    else  
                        current_json['body']= [contents]
                    end
                end
            end
            @table_data[key] = current_json
        end
        gon.push table_data: @table_data       
    end


end
