class DatabaseController < ApplicationController
    $db_data_dir = File.join(Rails.root, "data", "static_viz_data")

    def overview
        table_json = {'histo_test1': 'histo_test1.csv',  'histo_test2': 'histo_test2.csv'};
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
