class OrganDatatable < ApplicationDatatable
    private
  
    def data
      organs.map do |organ|
        [].tap do |column|
          column << ""
          Organ.column_names.each do |attr|
            if attr != 'cover_image'
              if attr != 'id'
                  column << "<div class='table_cell'> #{organ[attr]} </div>"
              else
                  column << organ[attr]
              end
            end
          end
          column << link_to('Show', organ)
        end
      end
    end
  
    def count
      Organ.count
    end
  
    def total_entries
      organs.total_count
      # will_paginate
      # users.total_entries
    end
  
    def organs
      @organs ||= fetch_organs
    end
  
    def fetch_organs
      search_string = []
      Organ.column_names.each do |attr|
        if Organ.columns_hash[attr].type != :string
          search_string << "cast(\"#{attr}\" as varchar(10)) like :search"
        else
          search_string << "\"#{attr}\" like :search"
        end
      end
      # search_col =['project_name', 'project_name', 'experiment_type']
      # search_col.each do |term|
      #   search_string << "#{term} like :search"
      # end
  
      # will_paginate
      # users = User.page(page).per_page(per_page)
      organs = Organ.order("#{sort_column} #{sort_direction}")
      organs = organs.page(page).per(per_page)
      if params[:search][:value] != ""
        organs = organs.where(search_string.join(' or '), search: "%#{params[:search][:value]}%")
      else
        organs = organs.page(page).per(per_page)
      end
      #projects = projects.where(search_string.join(' or '), search: "%#{params[:search][:value]}%")
    end
  
    def columns
      Organ.column_names
      # %w(first_name last_name email phone_number)
    end
  end